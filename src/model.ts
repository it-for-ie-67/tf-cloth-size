// import "@tensorflow/tfjs-backend-cpu";
// import "@tensorflow/tfjs-backend-webgl";
import { loadGraphModel } from "@tensorflow/tfjs-converter";

export async function load_model() {
  const MODEL_URL = "model/model.json";
  const model = await loadGraphModel(MODEL_URL);
  return model;
}
