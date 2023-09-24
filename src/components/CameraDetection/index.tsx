import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  DetectedObject,
  ObjectDetection,
  load,
} from "@tensorflow-models/coco-ssd";
import { drawRect } from "./utilities";

const CameraDetection = ({ id }: { id: string }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [counter, setCounter] = useState(-1);
  const [personActived, isPersonActived] = useState(false);

  useEffect(() => {
    if (personActived) {
      const interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCounter(0);
    }
  }, [personActived]);

  useEffect(() => {
    if (counter === 10) {
      console.log(`Pessoa identificada por 10 segundos!`);
    }
  }, [counter]);

  useEffect(() => {
    runCoco();
  });

  const checkIfperson = (obj: any[]) => {
    const person = obj.find(
      (element) => element.class === "person" && element.score > 0.6
    );
    return person !== undefined ? true : false;
  };

  // Main function
  const runCoco = async () => {
    const net: ObjectDetection = await load();
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net: ObjectDetection) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = 640;
      const videoHeight = 480;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      if (canvasRef.current) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
      }

      // Make Detections
      const obj: DetectedObject[] = await net.detect(video);
      if (checkIfperson(obj)) {
        isPersonActived(true);
      } else {
        isPersonActived(false);
      }
      // Draw mesh
      if (canvasRef.current) {
        const ctx: CanvasRenderingContext2D | null =
          canvasRef.current.getContext("2d");

        drawRect(obj, ctx);
      }
    }
  };

  return (
    <div className="container-camera">
      <div className="content-camera">
        <Webcam
          ref={webcamRef}
          muted={true}
          videoConstraints={{ deviceId: id }}
        />
      </div>
      <div className="camera-overlay">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default CameraDetection;
