export const replaceUrls = (content) => {
  return content.replace(/src=(['"])\/tasks_images\//g, `src=$1${useRuntimeConfig().public.API_URL}/tasks_images/`);
};
