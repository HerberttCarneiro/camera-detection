import React, { useEffect, useState } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import '@tensorflow/tfjs-backend-cpu';

import "./App.css";
import CameraDetection from "./components/CameraDetection";

function App() {
  const [camerasAvailable, setCamerasAvailable] = useState<MediaDeviceInfo[]>(
    []
  );

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
    } else {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          console.log(videoDevices, "videoDevices");
          setCamerasAvailable(videoDevices);
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
    }
  }, []);

  const CreateCameraDectetion = () => {
    return (
      <>
        {camerasAvailable.map((camera) => (
          <CameraDetection key={camera.deviceId} id={camera.deviceId} />
        ))}
      </>
    );
  };

  return (
    <div className="App">
      <CreateCameraDectetion />
    </div>
  );
}

export default App;
