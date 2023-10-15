import React, { useEffect, useState } from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import * as tf from "@tensorflow/tfjs";

import { Canvas } from "../Canvas";
import { createModel } from "./utils";
import { PREDICTIONS } from "./constants";

const StyledBox = styled(Box)`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export function ModelTF() {
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<
    tf.LayersModel | tf.Sequential | undefined
  >(undefined);
  const [tensor, setTensor] = useState<tf.Tensor | undefined>(undefined);
  const [prediction, setPrediction] = useState("");

  const loadModel = async () => {
    setIsLoading(true);
    try {
      // Load existing model in localstorage
      const loadedModel = await tf.loadLayersModel(
        "localstorage://number-predict-model"
      );
      setModel(loadedModel);
    } catch (err) {
      // Create new model on error or no data
      const model = createModel();
      setModel(model);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isLoading || !model) return <Typography>loading model...</Typography>;

  const canvasChangeHandler = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;

    const tensor = tf.browser.fromPixels(canvas).as2D(1, -1).div(255);
    tensor.print();
    console.log(tensor.shape);
    setTensor(tensor);
    modelPredictHandler();
  };

  const modelLearnHandler = async (e: React.MouseEvent) => {
    const btn = e.target as HTMLButtonElement;
    const label = btn.textContent;

    if (!tensor || !label) return;

    const xs = tensor;
    const ys = tf.tensor([[+label]]);

    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    model.fit(xs, ys, { epochs: 50, batchSize: 32 }).then((info) => {
      console.log("info", info);
    });
    await model.save("localstorage://number-predict-model");

    modelPredictHandler();
  };

  const modelPredictHandler = () => {
    if (!tensor) return;

    const prediction = model.predict(tensor) as tf.Tensor;
    console.log("Prediction: ", prediction);
    setPrediction(`${Math.round(prediction.dataSync()[0])}`);
  };

  return (
    <>
      <Canvas onChange={canvasChangeHandler} />
      <StyledBox>
        {PREDICTIONS.map((el) => (
          <Button onClick={modelLearnHandler} variant="contained" key={el}>
            {el}
          </Button>
        ))}
        <Button onClick={modelPredictHandler} variant="contained">
          PREDICT
        </Button>
      </StyledBox>
      {prediction && (
        <Typography align="center" margin={1}>
          Prediction: {prediction}
        </Typography>
      )}
    </>
  );
}
