const fal = require('../credentials/falai')

const createImageIA = async (prompt, w, h, mode) => {
  
  const result = await fal.subscribe("fal-ai/lora", {
    input: {
      model_name: "stabilityai/stable-diffusion-xl-base-1.0",
      prompt,
      
    },
    
    logs: mode == 'debug' ? true : false,
    onQueueUpdate: mode == 'debug' ? (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    }: null,
  });
  return result
};

module.exports = createImageIA;
