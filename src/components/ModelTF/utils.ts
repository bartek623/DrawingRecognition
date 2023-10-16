import * as tf from "@tensorflow/tfjs";
import { CANVAS_ELEMENTS_LENGTH, COMPILER_CONFIG } from "./constants";

export const createModel = () => {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 1,
      inputShape: [CANVAS_ELEMENTS_LENGTH],
    })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile(COMPILER_CONFIG);

  return model;
};
