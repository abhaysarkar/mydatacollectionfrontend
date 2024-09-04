



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone, faStop, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
// import ConfirmationModal from './ConfirmationModal'; // Import the custom modal
// import './AudioRecordingComponent.css'; // Import your CSS file
// import AudioLoader from './AudioLoader'; // Import your loader component

// const AudioRecordingComponent = ({ email, medicalField, subDepartment, markAsRead }) => {
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [recording, setRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioUrl, setAudioUrl] = useState('');
//   const [recordingTime, setRecordingTime] = useState(0); // in seconds
//   const [showModal, setShowModal] = useState(false); // State to control modal visibility
//   const [loading, setLoading] = useState(false); // New state for loading
//   const [uploadStatus, setUploadStatus] = useState(''); // New state for upload status


//   // Start recording
//   const startRecording = async () => {
//     setAudioUrl('');
//     setUploadStatus('');
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     recorder.ondataavailable = (e) => setAudioChunks((prev) => [...prev, e.data]);
//     setMediaRecorder(recorder);
//     recorder.start();
//     setRecording(true);
//   };

//   // Stop recording
//   const stopRecording = () => {
//     mediaRecorder.stop();
//     setRecording(false);
//   };

//   // Cancel recording
//   const cancelRecording = () => {
//     if (recording) {
//       mediaRecorder.stop();
//     }
//     setAudioChunks([]);
//     setRecording(false);
//     setRecordingTime(0); // Reset time
//   };

//   // Merge audio chunks into a single blob
//   const mergeAudioChunks = async (chunks) => {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const buffers = await Promise.all(chunks.map(chunk => new Response(chunk).arrayBuffer().then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))));

//     const outputBuffer = audioContext.createBuffer(
//       buffers[0].numberOfChannels,
//       buffers.reduce((sum, buffer) => sum + buffer.length, 0),
//       buffers[0].sampleRate
//     );

//     let offset = 0;
//     for (const buffer of buffers) {
//       for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
//         outputBuffer.getChannelData(channel).set(buffer.getChannelData(channel), offset);
//       }
//       offset += buffer.length;
//     }

//     return audioBufferToWav(outputBuffer);
//   };

//   // Convert audio buffer to WAV format
//   const audioBufferToWav = (buffer) => {
//     const numOfChan = buffer.numberOfChannels;
//     const length = buffer.length * numOfChan * 2 + 44;
//     const bufferArray = new ArrayBuffer(length);
//     const view = new DataView(bufferArray);

//     const channels = [];
//     let offset = 44; // Skip header

//     for (let i = 0; i < numOfChan; i++) {
//       channels.push(buffer.getChannelData(i));
//     }

//     // Helper functions to write data to DataView
//     const setUint16 = (dataOffset, value) => {
//       view.setUint16(dataOffset, value, true);
//     };

//     const setUint32 = (dataOffset, value) => {
//       view.setUint32(dataOffset, value, true);
//     };

//     // RIFF identifier 'RIFF'
//     setUint32(0, 0x46464952);
//     // file length
//     setUint32(4, length - 8);
//     // RIFF type 'WAVE'
//     setUint32(8, 0x45564157);
//     // format chunk identifier 'fmt '
//     setUint32(12, 0x20746D66);
//     // format chunk length
//     setUint32(16, 16);
//     // sample format (raw)
//     setUint16(20, 1);
//     // channel count
//     setUint16(22, numOfChan);
//     // sample rate
//     setUint32(24, buffer.sampleRate);
//     // byte rate (sample rate * block align)
//     setUint32(28, buffer.sampleRate * numOfChan * 2);
//     // block align (channel count * bytes per sample)
//     setUint16(32, numOfChan * 2);
//     // bits per sample
//     setUint16(34, 16);
//     // data chunk identifier 'data'
//     setUint32(36, 0x61746164);
//     // data chunk length
//     setUint32(40, length - 44);

//     // write interleaved data
//     for (let i = 0; i < buffer.length; i++) {
//       for (let channel = 0; channel < numOfChan; channel++) {
//         const sample = Math.max(-1, Math.min(1, channels[channel][i]));
//         view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
//         offset += 2;
//       }
//     }

//     return new Blob([bufferArray], { type: 'audio/wav' });
//   };

//   // Add flag status to the server
//   const addFlagStatus = async (email, flag, subDepartmentId, medicalFieldId) => {
//     try {
//       const flagStatusObj = { email, flag, subDepartmentId, medicalFieldId };
//       await axios.post('https://datacollection-backend-eb040f587829.herokuapp.com/api/add-flag-status', flagStatusObj, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log('Flag status added successfully');
//     } catch (error) {
//       console.error('Error adding flag status:', error);
//     }
//   };

//   // Upload audio file to the server
//   const uploadAudio = async () => {
//     setLoading(true); // Start loading
//     setUploadStatus('Uploading...'); // Set upload status message

//     if (audioChunks.length > 0) {
//       const audioBlob = await mergeAudioChunks(audioChunks);
//       const formData = new FormData();
//       const file = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
//       formData.append('file', file);
//       formData.append('email', email);
//       formData.append('medicalField', medicalField);
//       formData.append('subDepartment', subDepartment);

//       try {
//         const response = await axios.post('https://datacollection-backend-eb040f587829.herokuapp.com/api/audio/upload', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setAudioUrl(response.data);
//         setUploadStatus('Upload successful'); // Set success message
//         //addFlagStatus(email, true, sid, mfid);
//         markAsRead();
//       } catch (error) {
//         console.error('Error uploading audio:', error);
//         setUploadStatus('Upload failed'); // Set error message
//       } finally {
//         setLoading(false); // End loading
//       }
//     } else {
//       setLoading(false); // End loading if no audio chunks
//     }
//     cancelRecording();
//   };

//   // Timer to update recording time
//   useEffect(() => {
//     let timer;
//     if (recording) {
//       timer = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000); // Update every second
//     } else if (!recording && recordingTime !== 0) {
//       clearInterval(timer);
//     }

//     return () => clearInterval(timer); // Cleanup on unmount
//   }, [recording, recordingTime]);

//   return (
//     <div className="audio-recording-container">
//       <h2>Audio Recording</h2>
//       <p className="recording-time">Recording Time: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</p>
//       <div className="button-group">
//         <button 
//           className={`recording-button ${recording ? 'stop' : 'start'}`} 
//           onClick={recording ? stopRecording : startRecording} 
//           aria-label={recording ? 'Stop Recording' : 'Start Recording'}
//         >
//           <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
//         </button>
//         <button 
//           className="cancel-button" 
//           onClick={cancelRecording} 
//           disabled={!recording && audioChunks.length === 0} 
//           aria-label="Cancel Recording"
//         >
//           <FontAwesomeIcon icon={faTimes} />
//         </button>
//         {audioChunks.length > 0 && (
//           <button 
//             className="upload-button" 
//             onClick={() => setShowModal(true)} 
//             aria-label="Upload Audio"
//           >
//             <FontAwesomeIcon icon={faUpload} />
//           </button>
//         )}
//       </div>
//       {loading && <AudioLoader />} {/* Show loader during upload */}
//       {uploadStatus && <p>{uploadStatus}</p>} {/* Show upload status message */}
//       {audioUrl && (
//         <p>Audio URL: <a href={audioUrl} target="_blank" rel="noopener noreferrer">{audioUrl}</a></p>
//       )}
//       <ConfirmationModal 
//         show={showModal} 
//         handleClose={() => setShowModal(false)} 
//         handleConfirm={() => {
//           uploadAudio();
//           setShowModal(false);
//         }} 
//         message="Are you sure you want to upload this audio file?"
//       />
//     </div>
//   );
// };

// export default AudioRecordingComponent;










//working perfectly fine with loader/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone, faStop, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
// import ConfirmationModal from './ConfirmationModal'; // Import the custom modal
// import './AudioRecordingComponent.css'; // Import your CSS file
// import AudioLoader from './AudioLoader'; // Import your loader component

// const AudioRecordingComponent = ({ email, medicalField, subDepartment, markAsRead }) => {
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [recording, setRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioUrl, setAudioUrl] = useState('');
//   const [recordingTime, setRecordingTime] = useState(0); // in seconds
//   const [showModal, setShowModal] = useState(false); // State to control modal visibility
//   const [loading, setLoading] = useState(false); // New state for loading
//   const [uploadStatus, setUploadStatus] = useState(''); // New state for upload status
//   const [audioRecordingLabel, setAudioRecordingLabel] = useState(false);

//   // Start recording
//   const startRecording = async () => {
//     setAudioRecordingLabel(true);
//     setAudioUrl('');
//     setUploadStatus('');
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     recorder.ondataavailable = (e) => setAudioChunks((prev) => [...prev, e.data]);
//     setMediaRecorder(recorder);
//     recorder.start();
//     setRecording(true);
//   };

//   // Stop recording
//   const stopRecording = () => {
//     mediaRecorder.stop();
//     setRecording(false);
//   };

//   // Cancel recording
//   const cancelRecording = () => {
//     stopRecording();
//     setAudioRecordingLabel(false);
//     if (recording) {
//       mediaRecorder.stop();
//     }
//     setAudioChunks([]);
//     setRecording(false);
//     setRecordingTime(0); // Reset time
//   };

//   // Merge audio chunks into a single blob
//   const mergeAudioChunks = async (chunks) => {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const buffers = await Promise.all(chunks.map(chunk => new Response(chunk).arrayBuffer().then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))));

//     const outputBuffer = audioContext.createBuffer(
//       buffers[0].numberOfChannels,
//       buffers.reduce((sum, buffer) => sum + buffer.length, 0),
//       buffers[0].sampleRate
//     );

//     let offset = 0;
//     for (const buffer of buffers) {
//       for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
//         outputBuffer.getChannelData(channel).set(buffer.getChannelData(channel), offset);
//       }
//       offset += buffer.length;
//     }

//     return audioBufferToWav(outputBuffer);
//   };

//   // Convert audio buffer to WAV format
//   const audioBufferToWav = (buffer) => {
//     const numOfChan = buffer.numberOfChannels;
//     const length = buffer.length * numOfChan * 2 + 44;
//     const bufferArray = new ArrayBuffer(length);
//     const view = new DataView(bufferArray);

//     const channels = [];
//     let offset = 44; // Skip header

//     for (let i = 0; i < numOfChan; i++) {
//       channels.push(buffer.getChannelData(i));
//     }

//     // Helper functions to write data to DataView
//     const setUint16 = (dataOffset, value) => {
//       view.setUint16(dataOffset, value, true);
//     };

//     const setUint32 = (dataOffset, value) => {
//       view.setUint32(dataOffset, value, true);
//     };

//     // RIFF identifier 'RIFF'
//     setUint32(0, 0x46464952);
//     // file length
//     setUint32(4, length - 8);
//     // RIFF type 'WAVE'
//     setUint32(8, 0x45564157);
//     // format chunk identifier 'fmt '
//     setUint32(12, 0x20746D66);
//     // format chunk length
//     setUint32(16, 16);
//     // sample format (raw)
//     setUint16(20, 1);
//     // channel count
//     setUint16(22, numOfChan);
//     // sample rate
//     setUint32(24, buffer.sampleRate);
//     // byte rate (sample rate * block align)
//     setUint32(28, buffer.sampleRate * numOfChan * 2);
//     // block align (channel count * bytes per sample)
//     setUint16(32, numOfChan * 2);
//     // bits per sample
//     setUint16(34, 16);
//     // data chunk identifier 'data'
//     setUint32(36, 0x61746164);
//     // data chunk length
//     setUint32(40, length - 44);

//     // write interleaved data
//     for (let i = 0; i < buffer.length; i++) {
//       for (let channel = 0; channel < numOfChan; channel++) {
//         const sample = Math.max(-1, Math.min(1, channels[channel][i]));
//         view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
//         offset += 2;
//       }
//     }

//     return new Blob([bufferArray], { type: 'audio/wav' });
//   };

//   // Upload audio file to the server
//   const uploadAudio = async () => {
//     setAudioRecordingLabel(false);
//     setLoading(true); // Start loading
//     setUploadStatus('Uploading...'); // Set upload status message

//     if (audioChunks.length > 0) {
//       const audioBlob = await mergeAudioChunks(audioChunks);
//       const formData = new FormData();
//       const file = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
//       formData.append('file', file);
//       formData.append('email', email);
//       formData.append('medicalField', medicalField);
//       formData.append('subDepartment', subDepartment);

//       try {
//         const response = await axios.post('https://datacollection-backend-eb040f587829.herokuapp.com/api/audio/upload', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setAudioUrl(response.data);
//         setUploadStatus('Upload successful'); // Set success message
//         markAsRead();
//       } catch (error) {
//         console.error('Error uploading audio:', error);
//         setUploadStatus('Upload failed'); // Set error message
//       } finally {
//         setLoading(false); // End loading
//       }
//     } else {
//       setLoading(false); // End loading if no audio chunks
//     }
//     cancelRecording();
//   };

//   // Timer to update recording time
//   useEffect(() => {
//     let timer;
//     if (recording) {
//       timer = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000); // Update every second
//     } else if (!recording && recordingTime !== 0) {
//       clearInterval(timer);
//     }

//     return () => clearInterval(timer); // Cleanup on unmount
//   }, [recording, recordingTime]);

//   return (
//     <div className="audio-recording-container">
//       <h2>Audio Recording</h2>
//       {audioRecordingLabel && <p className="recording-time">Recording Time: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</p>}
//       <div className="button-group">
//         <button 
//           className={`recording-button ${recording ? 'stop' : 'start'}`} 
//           onClick={recording ? stopRecording : startRecording} 
//           aria-label={recording ? 'Stop Recording' : 'Start Recording'}
//         >
//           <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
//         </button>
//         {recording || audioChunks.length > 0 ? (
//           <>
//             <button 
//               className="cancel-button" 
//               onClick={cancelRecording} 
//               aria-label="Cancel Recording"
//             >
//               <FontAwesomeIcon icon={faTimes} />
//             </button>
//             {!recording && (
//               <button 
//                 className="upload-button" 
//                 onClick={() => setShowModal(true)} 
//                 aria-label="Upload Audio"
//               >
//                 <FontAwesomeIcon icon={faUpload} />
//               </button>
//             )}
//           </>
//         ) : null}
//       </div>
//       {loading && <AudioLoader />} {/* Show loader during upload */}
//       {uploadStatus && <p>{uploadStatus}</p>} {/* Show upload status message */}
//       {audioUrl && (
//         <p>Audio URL: <a href={audioUrl} target="_blank" rel="noopener noreferrer">{audioUrl}</a></p>
//       )}
//       <ConfirmationModal 
//         show={showModal} 
//         handleClose={() => setShowModal(false)} 
//         handleConfirm={() => {
//           uploadAudio();
//           setShowModal(false);
//         }} 
//         message="Are you sure you want to upload this audio file?"
//       />
//     </div>
//   );
// };

// export default AudioRecordingComponent;








//It is perfectly working
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone, faStop, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
// import './AudioRecordingComponent.css'; // Import your CSS file
// import AudioLoader from './AudioLoader'; // Import your loader component

// const AudioRecordingComponent = ({ email, medicalField, subDepartment, markAsRead }) => {
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [recording, setRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioUrl, setAudioUrl] = useState('');
//   const [recordingTime, setRecordingTime] = useState(0); // in seconds
//   const [showModal, setShowModal] = useState(false); // State to control modal visibility
//   const [loading, setLoading] = useState(false); // New state for loading
//   const [uploadStatus, setUploadStatus] = useState(''); // New state for upload status
//   const [audioRecordingLabel, setAudioRecordingLabel] = useState(false);
//   const [uploadingStatus, setUploadingStatus] = useState('')


//   const SmallLoader = () => {
//     return (
//       // <div class="spinner-border text-success" role="status">
//       //   <span class="visually-hidden">Uploading</span>
//       // </div>

//       // <button class="btn btn-success mt-3" type="button" disabled>
//       //   <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//       //   &nbsp;Audio Uploading&nbsp;
//       //   <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//       // </button>

//       <div className='mt-3'>
//         <div class="spinner-border text-primary" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-border text-secondary" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     )
//   }

//   // Start recording
//   const startRecording = async () => {
//     setAudioRecordingLabel(true);
//     setAudioUrl('');
//     setUploadStatus('');
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     recorder.ondataavailable = (e) => setAudioChunks((prev) => [...prev, e.data]);
//     setMediaRecorder(recorder);
//     recorder.start();
//     setRecording(true);
//   };

//   // Stop recording
//   const stopRecording = () => {
//     mediaRecorder.stop();
//     setRecording(false);
//   };

//   // Cancel recording
//   const cancelRecording = () => {
//     stopRecording();
//     setAudioRecordingLabel(false);
//     if (recording) {
//       mediaRecorder.stop();
//     }
//     setAudioChunks([]);
//     setRecording(false);
//     setRecordingTime(0); // Reset time
//   };

//   // Merge audio chunks into a single blob
//   const mergeAudioChunks = async (chunks) => {
//     // ... Your mergeAudioChunks function
//   };

//   // Convert audio buffer to WAV format
//   const audioBufferToWav = (buffer) => {
//     // ... Your audioBufferToWav function
//   };

//   // Upload audio file to the server
//   const uploadAudio = async () => {
//     setUploadStatus('Your Voice is Being Uploaded...'); // Set upload status message
//     setAudioRecordingLabel(false);
//     setLoading(true); // Start loading
    

//     if (audioChunks.length > 0) {
//       const audioBlob = await mergeAudioChunks(audioChunks);
//       const formData = new FormData();
//       const file = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
//       formData.append('file', file);
//       formData.append('email', email);
//       formData.append('medicalField', medicalField);
//       formData.append('subDepartment', subDepartment);

//       try {
//         const response = await axios.post('https://datacollection-backend-eb040f587829.herokuapp.com/api/audio/upload', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setAudioUrl(response.data);
//         setUploadStatus('Upload successful'); // Set success message
//         markAsRead();
//       } catch (error) {
//         console.error('Error uploading audio:', error);
//         setUploadStatus('Upload failed'); // Set error message
//       } finally {
//         setUploadingStatus('Audio Uploaded Successfully')
//         setLoading(false); // End loading
//       }
//     } else {
//       setLoading(false); // End loading if no audio chunks
//     }
//     cancelRecording();
//   };

//   // Timer to update recording time
//   useEffect(() => {
//     let timer;
//     if (recording) {
//       timer = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000); // Update every second
//     } else if (!recording && recordingTime !== 0) {
//       clearInterval(timer);
//     }

//     return () => clearInterval(timer); // Cleanup on unmount
//   }, [recording, recordingTime]);

//   return (
//     <div className="audio-recording-container">
//       <h5>Audio Recording</h5>
//       {audioRecordingLabel && <p className="recording-time">Recording Time: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</p>}
//       <div className="button-group">
//         <button
//           className={`recording-button ${recording ? 'stop' : 'start'}`}
//           onClick={recording ? stopRecording : startRecording}
//           aria-label={recording ? 'Stop Recording' : 'Start Recording'}
//         >
//           <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
//         </button>
//         {recording || audioChunks.length > 0 ? (
//           <>
//             <button
//               className="cancel-button"
//               onClick={cancelRecording}
//               aria-label="Cancel Recording"
//             >
//               <FontAwesomeIcon icon={faTimes} />
//             </button>
//             {!recording && (
//               <button
//                 className="upload-button"
//                 onClick={() => setShowModal(true)}
//                 aria-label="Upload Audio"
//               >
//                 <FontAwesomeIcon icon={faUpload} />
//               </button>

//             )}
//           </>
//         ) : null}
//       </div>
//       {loading && <SmallLoader />} {/* Show loader during upload */}
//       {uploadStatus && <p>{uploadStatus}</p>} 
//       {/* {audioUrl && (
//         <p>Audio URL: <a href={audioUrl} target="_blank" rel="noopener noreferrer">{audioUrl}</a></p>
//       )} */}


//       {/* {audioUrl ? (<p>{uploadingStatus}</p>):(<p>{uploadingStatus}</p>)} */}

//       {/* Bootstrap Modal */}
//       <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="exampleModalLabel" aria-hidden={!showModal}>
//         <div className="modal-dialog" role="document">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="exampleModalLabel">Confirm Upload</h5>
//               <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//               </button>
//             </div>
//             <div className="modal-body">
//               Are you sure you want to upload this audio file?
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
//               <button type="button" className="btn btn-primary" onClick={() => { uploadAudio(); setShowModal(false); }}>Upload</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AudioRecordingComponent;











//working perfectly fine with loader/////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from './ConfirmationModal'; // Import the custom modal
import './AudioRecordingComponent.css'; // Import your CSS file
import AudioLoader from './AudioLoader'; // Import your loader component


const AudioRecordingComponent = ({ email, medicalField, subDepartment, markAsReadHelper }) => {
  const [audioChunks, setAudioChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [recordingTime, setRecordingTime] = useState(0); // in seconds
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(false); // New state for loading
  const [uploadStatus, setUploadStatus] = useState(''); // New state for upload status
  const [audioRecordingLabel, setAudioRecordingLabel] = useState(false);


  // Start recording
  const startRecording = async () => {
    setAudioRecordingLabel(true);
    setAudioUrl('');
    setUploadStatus('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => setAudioChunks((prev) => [...prev, e.data]);
    setMediaRecorder(recorder);
    recorder.start();
    setRecording(true);
  };


  // Stop recording
  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };


  // Cancel recording
  const cancelRecording = () => {
    stopRecording();
    setAudioRecordingLabel(false);
    if (recording) {
      mediaRecorder.stop();
    }
    setAudioChunks([]);
    setRecording(false);
    setRecordingTime(0); // Reset time
  };


  // Merge audio chunks into a single blob
  const mergeAudioChunks = async (chunks) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const buffers = await Promise.all(chunks.map(chunk => new Response(chunk).arrayBuffer().then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))));


    const outputBuffer = audioContext.createBuffer(
      buffers[0].numberOfChannels,
      buffers.reduce((sum, buffer) => sum + buffer.length, 0),
      buffers[0].sampleRate
    );


    let offset = 0;
    for (const buffer of buffers) {
      for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        outputBuffer.getChannelData(channel).set(buffer.getChannelData(channel), offset);
      }
      offset += buffer.length;
    }


    return audioBufferToWav(outputBuffer);
  };


  // Convert audio buffer to WAV format
  const audioBufferToWav = (buffer) => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);


    const channels = [];
    let offset = 44; // Skip header


    for (let i = 0; i < numOfChan; i++) {
      channels.push(buffer.getChannelData(i));
    }


    // Helper functions to write data to DataView
    const setUint16 = (dataOffset, value) => {
      view.setUint16(dataOffset, value, true);
    };


    const setUint32 = (dataOffset, value) => {
      view.setUint32(dataOffset, value, true);
    };


    // RIFF identifier 'RIFF'
    setUint32(0, 0x46464952);
    // file length
    setUint32(4, length - 8);
    // RIFF type 'WAVE'
    setUint32(8, 0x45564157);
    // format chunk identifier 'fmt '
    setUint32(12, 0x20746D66);
    // format chunk length
    setUint32(16, 16);
    // sample format (raw)
    setUint16(20, 1);
    // channel count
    setUint16(22, numOfChan);
    // sample rate
    setUint32(24, buffer.sampleRate);
    // byte rate (sample rate * block align)
    setUint32(28, buffer.sampleRate * numOfChan * 2);
    // block align (channel count * bytes per sample)
    setUint16(32, numOfChan * 2);
    // bits per sample
    setUint16(34, 16);
    // data chunk identifier 'data'
    setUint32(36, 0x61746164);
    // data chunk length
    setUint32(40, length - 44);


    // write interleaved data
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }


    return new Blob([bufferArray], { type: 'audio/wav' });
  };


  // Upload audio file to the server
  const uploadAudio = async () => {
    setAudioRecordingLabel(false);
    setLoading(true); // Start loading
    setUploadStatus('Uploading...'); // Set upload status message


    if (audioChunks.length > 0) {
      const audioBlob = await mergeAudioChunks(audioChunks);
      const formData = new FormData();
      const file = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
      formData.append('file', file);
      formData.append('email', email);
      formData.append('medicalField', medicalField);
      formData.append('subDepartment', subDepartment);


      try {
        const response = await axios.post('https://datacollection-backend-eb040f587829.herokuapp.com/api/audio/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setAudioUrl(response.data);
        setUploadStatus('Upload successful'); // Set success message
        markAsReadHelper();
      } catch (error) {
        console.error('Error uploading audio:', error);
        setUploadStatus('Upload failed'); // Set error message
      } finally {
        setLoading(false); // End loading
      }
    } else {
      setLoading(false); // End loading if no audio chunks
    }
    cancelRecording();
  };


  // Timer to update recording time
  useEffect(() => {
    let timer;
    if (recording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000); // Update every second
    } else if (!recording && recordingTime !== 0) {
      clearInterval(timer);
    }


    return () => clearInterval(timer); // Cleanup on unmount
  }, [recording, recordingTime]);


  return (
    <div className="audio-recording-container">
      <h5>Audio Recording</h5>
      {audioRecordingLabel && <p className="recording-time">Recording Time: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</p>}
      <div className="button-group">
        <button
          className={`recording-button ${recording ? 'stop' : 'start'}`}
          onClick={recording ? stopRecording : startRecording}
          aria-label={recording ? 'Stop Recording' : 'Start Recording'}
        >
          <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
        </button>
        {recording || audioChunks.length > 0 ? (
          <>
            <button
              className="cancel-button"
              onClick={cancelRecording}
              aria-label="Cancel Recording"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {!recording && (
              <button
                className="upload-button"
                onClick={() => setShowModal(true)}
                aria-label="Upload Audio"
              >
                <FontAwesomeIcon icon={faUpload} />
              </button>
            )}
          </>
        ) : null}
      </div>
      {loading && <AudioLoader />} {/* Show loader during upload */}
      {uploadStatus && <p>{uploadStatus}</p>} {/* Show upload status message */}
      {audioUrl && (
        <p>Audio URL: <a href={audioUrl} target="_blank" rel="noopener noreferrer">{audioUrl}</a></p>
      )}
      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={() => {
          uploadAudio();
          setShowModal(false);
        }}
        message="Are you sure you want to upload this audio file?"
      />
    </div>
  );
};


export default AudioRecordingComponent;
