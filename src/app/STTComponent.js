import { useState, useRef } from "react";
import axios from "axios";
import RecordRTC from "recordrtc";

export default function STTComponent() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder.current = RecordRTC(stream, { type: "audio" });
      mediaRecorder.current.startRecording();
      setRecording(true);
    });
  };

  const handleStopRecording = () => {
    mediaRecorder.current.stopRecording(() => {
      const blob = mediaRecorder.current.getBlob();
      const file = new File([blob], "audio.mp3");

      setLoading(true);
      transcribeAudio(file).then((data) => {
        setTranscript(data);
        setLoading(false);
      });

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
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {recording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={handleStartRecording}>Start Recording</button>
      )}
      {loading ? <p>Loading...</p> : <p>{JSON.stringify(transcript)}</p>}
    </div>
  );
}
