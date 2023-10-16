import React, { useEffect, useState } from "react";
import { Box, Button, Input, Typography, styled } from "@mui/material";
import * as tf from "@tensorflow/tfjs";

import { Canvas, CanvasTest } from "../Canvas";
import { createModel, onDownload } from "./utils";
import { COMPILER_CONFIG, PREDICTIONS } from "./constants";

const StyledBox = styled(Box)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`;

type tensorDataArray =
  | number
  | number[]
  | number[][]
  | number[][][]
  | number[][][][]
  | number[][][][][]
  | number[][][][][][];

export type TrainDataType = {
  xs: tensorDataArray;
  ys: tensorDataArray;
}[];

export function ModelTF() {
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<
    tf.LayersModel | tf.Sequential | undefined
  >(undefined);
  const [tensor, setTensor] = useState<tf.Tensor | undefined>(undefined);
  const [prediction, setPrediction] = useState("");
  const [trainData, setTrainData] = useState<TrainDataType>([]);

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

    const tensor = tf.browser.fromPixels(canvas, 1).as2D(1, -1).div(255);
    setTensor(tensor);
  };

  const modelLearnHandler = async (label: number) => {
    if (!tensor) return;

    setIsLoading(true);

    const xs = tensor;
    const ys = tf.tensor([[label / 9]]);

    setTrainData((prev) => [
      ...prev,
      { xs: xs.arraySync(), ys: ys.arraySync() },
    ]);

    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  };

  const modelLearnOnClickHandler = async (e: React.MouseEvent) => {
    const btn = e.target as HTMLButtonElement;
    const label = btn.textContent;

    if (!label) return;

    modelLearnHandler(+label);
  };

  const modelPredictHandler = () => {
    if (!tensor) return;

    const prediction = model.predict(tensor) as tf.Tensor;
    console.log(prediction.dataSync());
    setPrediction((prediction.dataSync()[0] * 9).toFixed(2));
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    const key = +e.key;
    if (!PREDICTIONS.includes(key)) return;
    modelLearnHandler(key);
  };

  const modelTrainHandler = (data = trainData) => {
    data.forEach(async (data) => {
      setIsLoading(true);

      const xs = tf.tensor(data.xs);
      const ys = tf.tensor(data.ys);

      model.compile(COMPILER_CONFIG);
      await model.fit(xs, ys, { epochs: 25 });
      await model.save("localstorage://number-predict-model");

      setIsLoading(false);
    });
  };

  const uploadAndTrainHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const reader = new FileReader();

    if (!input.files) return;

    reader.readAsText(input.files[0], "UTF-8");
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result?.toString();
      const data = result && JSON.parse(result).data;

      if (!data) return;

      setTrainData(data);
    };
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <CanvasTest tensor={tensor} />
        <Typography>Train items: {trainData.length}</Typography>
        {PREDICTIONS.map((num) => (
          <Typography key={num}>
            {`${num}: [${
              trainData.filter(
                (el) => el.ys[0][0].toFixed(2) === (num / 9).toFixed(2)
              ).length
            }]`}
          </Typography>
        ))}
      </Box>
      <Canvas onChange={canvasChangeHandler} onKeyDown={keyDownHandler} />
      <StyledBox>
        {PREDICTIONS.map((el) => (
          <Button
            onClick={modelLearnOnClickHandler}
            variant="contained"
            key={el}
          >
            {el}
          </Button>
        ))}
        <Button onClick={modelPredictHandler} variant="contained">
          PREDICT
        </Button>
        <Button onClick={() => modelTrainHandler()} variant="contained">
          TRAIN
        </Button>
        <Button onClick={() => onDownload(trainData)} variant="contained">
          DOWNLOAD TRAIN DATA
        </Button>
        <Input type="file" onChange={uploadAndTrainHandler} />
      </StyledBox>
      {prediction && (
        <Typography align="center" margin={1}>
          Prediction: {prediction}
        </Typography>
      )}
    </>
  );
}
