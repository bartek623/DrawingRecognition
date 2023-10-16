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
    setTensor(tensor);
  };

  const modelLearnHandler = async (e: React.MouseEvent) => {
    const btn = e.target as HTMLButtonElement;
    const label = btn.textContent;
    console.log(label);

    if (!tensor || !label) return;

    const xs = tensor;
    const ys = tf.tensor([[+label]]);

    model.compile({
      loss: "meanSquaredError",
      optimizer: "adam",
    });

    setIsLoading(true);
    model.fit(xs, ys, { epochs: 5 }).then((info) => {
      setIsLoading(false);
      console.log("info", info);
    });
    await model.save("localstorage://number-predict-model");

    modelPredictHandler();
  };

  const modelPredictHandler = () => {
    if (!tensor) return;

    const prediction = model.predict(tensor) as tf.Tensor;
    console.log(prediction.dataSync());
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
