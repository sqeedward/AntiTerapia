import { useState, useRef } from 'react';

function InputForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [roastLevel, setRoastLevel] = useState('Medium');
  const [noGoTopics, setNoGoTopics] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, photo, audio }, roastLevel, noGoTopics);
  };

  const handleFileAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudio(file);
      setAudioURL(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tell your life story...</label>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent" 
          placeholder="What's your story? We're ready to roast it!" 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          rows="4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Audio Input</label>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-md font-medium ${
              isRecording 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
          </button>
        </div>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileAudioChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Or upload an audio file"
        />
        {audioURL && (
          <div className="mt-2">
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Roast Intensity</label>
        <select 
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent" 
          value={roastLevel} 
          onChange={(e) => setRoastLevel(e.target.value)}
        >
          <option value="Light">😊 Light Roast</option>
          <option value="Medium">🔥 Medium Roast</option>
          <option value="Brutal">💀 Brutal Roast</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">No-Go Topics (optional)</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent" 
          placeholder="e.g., family, health, job loss" 
          value={noGoTopics} 
          onChange={(e) => setNoGoTopics(e.target.value)} 
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white p-3 rounded-md font-bold text-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 transform hover:scale-105"
      >
        🔥 Get Roasted! 🔥
      </button>
    </form>
  );
}

export default InputForm; 