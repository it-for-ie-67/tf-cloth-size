import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { load_model } from "./model";
import { GraphModel } from "@tensorflow/tfjs";
import "./App.css";

interface Size {
  prob: number;
  idx: number;
  size: string;
}

function App() {
  const [weightTxt, setWeightTxt] = useState("");
  const [ageTxt, setAgeTxt] = useState("");
  const [heightTxt, setHeightTxt] = useState("");
  const [model, setModel] = useState<GraphModel | null>(null);
  const [prediction, setPrediction] = useState<Size[] | null>(null);
  useEffect(() => {
    load_model().then((model) => setModel(model));
  }, []);

  // Initial test
  // if (model) {
  //   const input = tf.tensor1d([61, 45, 172.72]).reshape([-1, 3]);
  //   const output = (model.predict(input) as tf.Tensor).dataSync();
  //   const outputFormatted = formatPrediction(output);
  //   console.log({ output, outputFormatted });
  // }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "weight") setWeightTxt(e.target.value);
    if (e.target.id === "age") setAgeTxt(e.target.value);
    if (e.target.id === "height") setHeightTxt(e.target.value);
  }

  function handleClick(weight: number, age: number, height: number) {
    if (!model) return;

    const input = tf.tensor1d([weight, age, height]).reshape([-1, 3]);
    const output = (model.predict(input) as tf.Tensor).dataSync();
    const outputFormatted = formatPrediction(output);
    setPrediction(outputFormatted);
  }

  const weight = parseFloat(weightTxt);
  const age = parseFloat(ageTxt);
  const height = parseFloat(heightTxt);
  const disabled = isNaN(weight) || isNaN(age) || isNaN(height);

  return (
    <>
      <h1>Cloth Size Prediction</h1>

      <div>
        <label htmlFor="weight">Weight</label>
        <input
          type="number"
          id="weight"
          value={weightTxt}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input type="number" id="age" value={ageTxt} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="height">Height</label>
        <input
          type="number"
          id="height"
          value={heightTxt}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={() => handleClick(weight, age, height)}
        disabled={disabled}
      >
        Predict
      </button>
      <div>Predicted Size</div>
      <div>
        {prediction?.slice(0, 3).map((p) => (
          <div key={p.size}>
            {p.size} (มั่นใจ {(p.prob * 100).toFixed(0)} %)
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

function formatPrediction(pred: tf.TypedArray) {
  const mapSize = {
    0: "XXS",
    1: "S",
    2: "M",
    3: "L",
    4: "XL",
    5: "XXL",
    6: "XXXL",
  } as { [key: number]: string };

  if (pred.length !== 7) return null;

  const outArr: Size[] = [];
  pred.forEach((p, i) => {
    outArr.push({ prob: p, idx: i, size: mapSize[i] });
  });
  outArr.sort((a, b) => b.prob - a.prob);
  return outArr;
}
