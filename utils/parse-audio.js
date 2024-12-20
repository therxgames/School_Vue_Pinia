export const parseAudio = (content) => {
  let audio = content.match(/<audio(.*?)audio>/)[0];
  content = content.replace(audio, '');
  const src = audio.match(/src=['"](.*?)['"]/)[1];

  return {
    content,
    src
  };
};
