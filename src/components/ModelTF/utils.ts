import * as tf from "@tensorflow/tfjs";
import { CANVAS_ELEMENTS_LENGTH } from "./constants";

export const createModel = () => {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({ units: 1, inputShape: [CANVAS_ELEMENTS_LENGTH] })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

  return model;
};
