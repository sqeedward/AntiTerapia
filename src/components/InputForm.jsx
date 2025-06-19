import { useState, useRef } from 'react';

function InputForm({ onSubmit, isLoading = false }) {
  const [inputType, setInputType] = useState('text'); // 'text', 'audio', 'image'
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recorded-audio.wav', { type: 'audio/wav' });
        setAudio(audioFile);
        setAudioURL(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudio(file);
      setAudioURL(URL.createObjectURL(file));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, photo, audio });
  };

  // Screenshot capture
  const handleTakeScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          setPhoto(file);
        }
        track.stop();
      }, 'image/png');
    } catch (err) {
      alert('Screenshot failed or was cancelled.');
    }
  };

  // Camera capture
  const handleOpenCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Unable to access camera.');
      setShowCamera(false);
    }
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'camera-photo.png', { type: 'image/png' });
        setPhoto(file);
      }
      // Stop camera
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
    }, 'image/png');
  };

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center gap-2 bg-gray-800 rounded-xl p-2 shadow-xl border border-gray-700">
      {/* Input type selector */}
      <div className="flex flex-col gap-1">
        <button type="button" onClick={() => setInputType('text')} className={`rounded-full p-2 ${inputType==='text' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}>📝</button>
        <button type="button" onClick={() => setInputType('audio')} className={`rounded-full p-2 ${inputType==='audio' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>🎤</button>
        <button type="button" onClick={() => setInputType('image')} className={`rounded-full p-2 ${inputType==='image' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'}`}>📸</button>
      </div>
      {/* Input field */}
      <div className="flex-1">
        {inputType === 'text' && (
          <input
            type="text"
            className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none"
            placeholder="Type your story..."
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={isLoading}
          />
        )}
        {inputType === 'audio' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-lg font-semibold ${isRecording ? 'bg-red-600' : 'bg-blue-600'} text-white`}
              disabled={isLoading}
            >
              {isRecording ? '⏹️ Stop' : '🎤 Record'}
            </button>
            <input type="file" accept="audio/*" onChange={handleFileAudioChange} className="hidden" id="audio-upload" disabled={isLoading} />
            <label htmlFor="audio-upload" className="cursor-pointer px-3 py-2 bg-gray-700 text-gray-200 rounded-lg">Upload</label>
            {audioURL && <audio controls src={audioURL} className="ml-2 h-8" />}
          </div>
        )}
        {inputType === 'image' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photo-upload" disabled={isLoading} />
              <label htmlFor="photo-upload" className="cursor-pointer px-3 py-2 bg-gray-700 text-gray-200 rounded-lg">Upload Image</label>
              <button type="button" onClick={handleOpenCamera} className="px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Take Photo</button>
              {photo && <span className="ml-2 text-gray-300">{photo.name}</span>}
              {photo && <button type="button" onClick={removePhoto} className="ml-2 text-red-400">×</button>}
            </div>
            {/* Camera Modal */}
            {showCamera && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-gray-900 p-6 rounded-xl shadow-xl flex flex-col items-center">
                  <video ref={videoRef} autoPlay playsInline className="rounded-lg mb-4 w-72 h-56 bg-black" />
                  <div className="flex gap-4">
                    <button type="button" onClick={handleTakePhoto} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold">Capture</button>
                    <button type="button" onClick={handleCloseCamera} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Submit */}
      <button type="submit" disabled={isLoading} className="ml-2 px-6 py-3 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50">
        {isLoading ? 'Roasting...' : 'Roast!'}
      </button>
    </form>
  );
}

export default InputForm;