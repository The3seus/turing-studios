//videocombiner.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { generateMusic } = require('./handlers/musicGenerator');

async function getMediaDuration(filePath) {
  const command = `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`;
  try {
    const output = execSync(command).toString();
    return parseFloat(output);
  } catch (error) {
    console.error(`Failed to get duration for file: ${filePath}, using default duration. Error: ${error.message}`);
    return 6; // Default duration for images
  }
}

function makeInfinite(clips, targetDuration) {
  let extendedClips = [];
  let currentDuration = 0;

  while (currentDuration < targetDuration) {
    for (let clip of clips) {
      if (currentDuration >= targetDuration) break;

      const remainingDuration = targetDuration - currentDuration;
      let clipToAdd = { ...clip };

      const randomDuration = Math.random() * (6 - 1) + 1;
      clipToAdd.duration = Math.min(clipToAdd.duration, randomDuration, remainingDuration);

      if (clipToAdd.layers[0].type === 'video') {
        clipToAdd.layers[0].cutTo = clipToAdd.duration;
      }

      extendedClips.push(clipToAdd);
      currentDuration += clipToAdd.duration;
    }
  }

  return extendedClips;
}

async function cutVideoToLength(videoPath, audioDuration) {
  const tempPath = `${videoPath}.temp.mp4`;
  const command = `ffmpeg -y -i "${videoPath}" -t ${audioDuration + 1} -c copy "${tempPath}" && mv "${tempPath}" "${videoPath}"`;
  execSync(command);
}

async function addMusicToVideo(videoPath, musicPath, outputPath, videoDuration) {
  const musicTempPath = path.join(path.dirname(musicPath), 'looped_music.mp3');
  const loopCommand = `ffmpeg -y -stream_loop -1 -i "${musicPath}" -t ${videoDuration} -c copy "${musicTempPath}"`;
  execSync(loopCommand);

  const command = `ffmpeg -y -i "${videoPath}" -i "${musicTempPath}" -filter_complex "[1:a]volume=0.4[a1];[0:a][a1]amix=inputs=2:duration=shortest[a]" -map 0:v -map "[a]" -c:v copy -shortest "${outputPath}"`;
  execSync(command);
}

async function adjustVoiceOverVolume(inputPath, outputPath, volumeLevel) {
  const command = `ffmpeg -y -i "${inputPath}" -filter:a "volume=${volumeLevel}" "${outputPath}"`;
  execSync(command);
}

async function combineMedia(videoPaths, voiceOverPath, outputPath, musicPrompt = null, extendDuration = 80, platform, onProgress) {
  const editly = await import('editly');

  let width, height;
  if (platform === 'tiktok') {
    width = 1080;
    height = 1920;
  } else {
    width = 1920;
    height = 1080;
  }

  try {
    const audioDuration = await getMediaDuration(voiceOverPath);
    const extendedAudioDuration = audioDuration + extendDuration;
    console.log(`Audio Duration: ${audioDuration}`);
    console.log(`Extended Audio Duration: ${extendedAudioDuration}`);

    onProgress(0.1); // 10% progress

    const adjustedVoiceOverPath = path.join(path.dirname(voiceOverPath), 'adjusted_voiceover.mp3');
    await adjustVoiceOverVolume(voiceOverPath, adjustedVoiceOverPath, 5.0);

    onProgress(0.2); // 20% progress

    const mediaFiles = videoPaths.filter(file => /\.(mp4|jpg|jpeg|png)$/i.test(file));

    if (mediaFiles.length === 0) {
      throw new Error('No media files found in the specified directory.');
    }

    let clips = await Promise.all(mediaFiles.map(async file => {
      let duration = await getMediaDuration(file);
      if (isNaN(duration) || duration <= 0) {
        duration = 6;
      }
      if (/\.(mp4)$/i.test(file)) {
        return { layers: [{ type: 'video', path: file, cutFrom: 0, cutTo: duration }], duration };
      } else {
        return { layers: [{ type: 'image', path: file }], duration: Math.random() * (3 - 1) + 1 };
      }
    }));

    onProgress(0.3); // 30% progress

    console.log(`Initial Clips: ${JSON.stringify(clips, null, 2)}`);

    let extendedClips = makeInfinite(clips, extendedAudioDuration);

    onProgress(0.4); // 40% progress

    console.log(`Extended Clips Before Adjustment: ${JSON.stringify(extendedClips, null, 2)}`);

    let currentDuration = extendedClips.reduce((acc, clip) => acc + clip.duration, 0);
    if (currentDuration > extendedAudioDuration) {
      const lastClip = extendedClips.pop();
      const remainingDuration = extendedAudioDuration - (currentDuration - lastClip.duration);
      if (lastClip.layers[0].type === 'video') {
        lastClip.layers[0].cutTo = lastClip.layers[0].cutFrom + remainingDuration;
      } else {
        lastClip.duration = remainingDuration;
      }
      extendedClips.push(lastClip);
    } else if (currentDuration < extendedAudioDuration) {
      const lastClip = { ...extendedClips[extendedClips.length - 1] };
      const remainingDuration = extendedAudioDuration - currentDuration;
      if (lastClip.layers[0].type === 'video') {
        lastClip.layers[0].cutTo = lastClip.layers[0].cutFrom + lastClip.duration + remainingDuration;
      } else {
        lastClip.duration += remainingDuration;
      }
      extendedClips[extendedClips.length - 1] = lastClip;
    }

    onProgress(0.5); // 50% progress

    console.log(`Final Clips Before Shuffle: ${JSON.stringify(extendedClips, null, 2)}`);

    const finalClips = extendedClips;
    console.log(`Final Clips: ${JSON.stringify(finalClips, null, 2)}`);

    const tempVideoPath = path.join(path.dirname(outputPath), 'temp_video.mp4');
    await editly.default({
      outPath: tempVideoPath,
      width: width,
      height: height,
      fps: 30,
      audioFilePath: adjustedVoiceOverPath,
      clips: finalClips,
      defaults: {
        transition: {
          duration: 0.5,
          name: 'random'
        },
        layer: {
          kenburns: true
        }
      }
    });

    onProgress(0.7); // 70% progress

    console.log('Final video created:', tempVideoPath);

    await cutVideoToLength(tempVideoPath, extendedAudioDuration);

    onProgress(0.8); // 80% progress

    console.log('Final video adjusted to audio length:', tempVideoPath);

    let musicPath = null;
    if (musicPrompt) {
      const musicDuration = Math.max(8, Math.min(20, extendedAudioDuration));
      musicPath = await generateMusic(musicDuration, musicPrompt);
    }

    if (musicPath) {
      await addMusicToVideo(tempVideoPath, musicPath, outputPath, extendedAudioDuration);
      console.log('Final video with music created:', outputPath);
    } else {
      fs.renameSync(tempVideoPath, outputPath);
      console.log('Final video created without music:', outputPath);
    }

    onProgress(1.0); // 100% progress

  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

module.exports = {
  combineMedia,
};

