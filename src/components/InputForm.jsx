import { useState, useRef } from 'react';

function InputForm({ onSubmit, isLoading = false, darkMode = false }) {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [roastLevel, setRoastLevel] = useState('Medium');
  const [noGoTopics, setNoGoTopics] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    if (photoURL) {
      URL.revokeObjectURL(photoURL);
      setPhotoURL(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
          🎯 Tell Us Your Story
        </h2>
        <p className={`transition-colors duration-300 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>Share your life story and let AI roast it with savage humor!</p>
      </div>

      {/* Text Input */}
      <div className="group">
        <label className={`block text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <span className="text-xl">📝</span>
          Your Life Story
        </label>
        <textarea 
          className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 resize-none group-hover:border-gray-300 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-red-900' 
              : 'border-gray-200 text-gray-800 placeholder-gray-500'
          }`}
          placeholder="What's your story? We're ready to roast it! 🍖" 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          rows="4"
          disabled={isLoading}
        />
      </div>

      {/* Photo Upload */}
      <div className="group">
        <label className={`block text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <span className="text-xl">📸</span>
          Upload a Photo
        </label>
        
        {/* Photo Preview */}
        {photoURL && (
          <div className="mb-4 relative">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src={photoURL} 
                alt="Uploaded photo" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
              >
                ×
              </button>
            </div>
            <p className={`text-sm mt-2 text-center transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Photo uploaded: {photo.name}
            </p>
          </div>
        )}

        {/* Upload Area */}
        {!photoURL && (
          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
              disabled={isLoading}
            />
            <label 
              htmlFor="photo-upload"
              className={`block w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 group-hover:border-gray-400 ${
                darkMode 
                  ? 'border-gray-600 hover:border-red-400 hover:bg-gray-700/50 text-gray-300' 
                  : 'border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">📷</span>
                <span className="font-medium">
                  Click to upload a photo
                </span>
                <span className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Selfie, outfit, or anything roastable!</span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Audio Input */}
      <div className="group">
        <label className={`block text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <span className="text-xl">🎤</span>
          Audio Input
        </label>
        
        {/* Recording Controls */}
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              isRecording 
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
            } disabled:opacity-50`}
          >
            <span className="flex items-center justify-center gap-2">
              {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
            </span>
          </button>
        </div>

        {/* File Upload */}
        <div className="relative">
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileAudioChange}
            className="hidden"
            id="audio-upload"
            disabled={isLoading}
          />
          <label 
            htmlFor="audio-upload"
            className={`block w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 group-hover:border-gray-400 ${
              darkMode 
                ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700/50 text-gray-300' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🎵</span>
              <span className="font-medium">
                Or upload an audio file
              </span>
              <span className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>MP3, WAV, or any audio format</span>
            </div>
          </label>
        </div>

        {/* Audio Preview */}
        {audioURL && (
          <div className={`mt-3 p-3 rounded-lg transition-colors duration-300 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}
      </div>

      {/* Roast Level Selection */}
      <div className="group">
        <label className={`block text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <span className="text-xl">🔥</span>
          Roast Intensity
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'Light', emoji: '😊', color: 'green', desc: 'Gentle roasts' },
            { value: 'Medium', emoji: '🔥', color: 'orange', desc: 'Balanced burns' },
            { value: 'Brutal', emoji: '💀', color: 'red', desc: 'Savage roasts' }
          ].map((level) => (
            <label
              key={level.value}
              className={`relative cursor-pointer group/level ${
                roastLevel === level.value ? 'ring-2 ring-red-400' : ''
              }`}
            >
              <input
                type="radio"
                name="roastLevel"
                value={level.value}
                checked={roastLevel === level.value}
                onChange={(e) => setRoastLevel(e.target.value)}
                className="sr-only"
                disabled={isLoading}
              />
              <div className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                roastLevel === level.value
                  ? darkMode 
                    ? 'border-red-400 bg-red-900/20 shadow-lg' 
                    : 'border-red-400 bg-red-50 shadow-lg'
                  : darkMode
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <div className="text-3xl mb-2">{level.emoji}</div>
                <div className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>{level.value}</div>
                <div className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{level.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* No-Go Topics */}
      <div className="group">
        <label className={`block text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <span className="text-xl">🚫</span>
          No-Go Topics (Optional)
        </label>
        <input 
          className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 group-hover:border-gray-300 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-red-900' 
              : 'border-gray-200 text-gray-800 placeholder-gray-500'
          }`}
          placeholder="e.g., family, health, job loss (separate with commas)" 
          value={noGoTopics} 
          onChange={(e) => setNoGoTopics(e.target.value)} 
          disabled={isLoading}
        />
        <p className={`text-xs mt-2 transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Topics you'd prefer the AI to avoid in roasts
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isLoading}
          className="group relative w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white p-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                🔥 Roasting... 🔥
              </>
            ) : (
              <>
                🔥 Get Roasted! 🔥
                <span className="text-sm opacity-80">→</span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </form>
  );
}

export default InputForm; 