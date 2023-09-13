import { useState, useRef } from "react";
import axios from "axios";
import RecordRTC from "recordrtc";

export default function STTComponent() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add an error state
  const mediaRecorder = useRef(null);

  const handleStartRecording = () => {
    const handleSuccess = (stream) => {
      mediaRecorder.current = RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
      });
      mediaRecorder.current.startRecording();
      setRecording(true);
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // For newer browsers
      navigator.mediaDevices.getUserMedia({ audio: true }).then(handleSuccess);
    } else if (navigator.getUserMedia) {
      // Fallback for Safari
      navigator.getUserMedia({ audio: true }, handleSuccess, (error) =>
        console.error(error)
      );
    } else {
      setError("Your browser does not support audio recording.");
    }
  };

  const handleStopRecording = () => {
    mediaRecorder.current.stopRecording(async () => {
      const blob = mediaRecorder.current.getBlob();
      const audioFile = new Blob([blob], { type: "audio/wav" });
      setLoading(true);
      const data = await transcribeAudio(audioFile);
      setTranscript(data);
      setLoading(false);

      mediaRecorder.current.reset();
      setRecording(false);
    });
  };

  async function transcribeAudio(audioFile) {
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      setError(error.message);
    }
  }

  return (
    <div>
      {recording ? (
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded dark:bg-indigo-800 dark:hover:bg-indigo-900"
          onClick={handleStopRecording}
        >
          Stop Recording
        </button>
      ) : (
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded dark:bg-indigo-800 dark:hover:bg-indigo-900"
          onClick={handleStartRecording}
        >
          Start Recording
        </button>
      )}
      {loading ? (
        <p className="text-gray-900 dark:text-gray-200">Loading...</p>
      ) : (
        <p className="text-gray-900 dark:text-gray-200">
          {JSON.stringify(transcript)}
        </p>
      )}
      {error && (
        <p className="text-red-500 text-lg font-bold dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
