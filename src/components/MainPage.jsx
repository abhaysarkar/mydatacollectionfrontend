// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useSwipeable } from 'react-swipeable';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import Loader from './Loader';
// import AudioRecordingComponent from './AudioRecordingComponent';
// import './MainPage.css';

// const MainPage = () => {
//   const [medicalFields, setMedicalFields] = useState([]);
//   const [selectedFieldId, setSelectedFieldId] = useState('');
//   const [subDepartments, setSubDepartments] = useState([]);
//   const [selectedSubDeptId, setSelectedSubDeptId] = useState('');
//   const [description, setDescription] = useState('');
//   const [readSubDepartments, setReadSubDepartments] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const [email, setEmail] = useState('');


//   useEffect(() => {
//     if (location.state?.email) {
//       setEmail(location.state.email);
//     }
//   }, [location.state]);


//   useEffect(() => {
//     axios.get('https://datacollection-backend-eb040f587829.herokuapp.com/api/medical-fields')
//       .then(response => {
//         setMedicalFields(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       });
//   }, []);


//   useEffect(() => {
//     if (selectedFieldId) {
//       const selectedField = medicalFields.find(field => field.id === parseInt(selectedFieldId));
//       if (selectedField) {
//         setSubDepartments(selectedField.subDepartments);
//         setSelectedSubDeptId('');
//         setDescription('');
//       }
//     }
//   }, [selectedFieldId, medicalFields]);


//   const getAgain = () => {
//     axios.get('http://localhost:8080/api/get-all-read-status')
//       .then(response => {
//         const readStatusData = response.data;
//         const readSubDepts = new Set();


//         readStatusData.forEach(status => {
//           if (status.read && status.email === email) {
//             readSubDepts.add(`${status.medicalFieldId}-${status.subDeptId}`);
//           }
//         });


//         setReadSubDepartments(readSubDepts);
//       })
//       .catch(error => {
//         console.error('Error fetching read status data:', error);
//       });
//   };


//   useEffect(() => {
//     if (email) {
//       getAgain(); // Call getAgain when the email is available
//     }
//   }, [email]);


//   useEffect(() => {
//     if (selectedSubDeptId) {
//       const selectedSubDept = subDepartments.find(subDept => subDept.id === parseInt(selectedSubDeptId));
//       if (selectedSubDept) {
//         setDescription(selectedSubDept.description);


//         // Mark as read when a sub-department is selected
//         // markAsRead(email, selectedFieldId, selectedSubDeptId);
//       }
//     }
//   }, [selectedSubDeptId, subDepartments, email, selectedFieldId]);


//   const handlePrevious = () => {
//     if (selectedSubDeptId) {
//       const currentIndex = subDepartments.findIndex(subDept => subDept.id === parseInt(selectedSubDeptId));
//       if (currentIndex > 0) {
//         setSelectedSubDeptId(subDepartments[currentIndex - 1].id);
//       }
//     }
//   };


//   const handleNext = () => {
//     if (selectedSubDeptId) {
//       const currentIndex = subDepartments.findIndex(subDept => subDept.id === parseInt(selectedSubDeptId));
//       if (currentIndex < subDepartments.length - 1) {
//         setSelectedSubDeptId(subDepartments[currentIndex + 1].id);
//       }
//     }
//   };


//   const swipeHandlers = useSwipeable({
//     onSwipedLeft: handleNext,
//     onSwipedRight: handlePrevious,
//     preventScrollOnSwipe: true,
//     trackMouse: true,
//   });


//   const markAsRead = (email, medicalFieldId, subDeptId) => {


//     const data = {
//       email: email,
//       medicalFieldId: parseInt(medicalFieldId),
//       subDeptId: parseInt(subDeptId),
//       read: true,
//     };


//     console.log(data)


//     axios.post('http://localhost:8080/api/mark-read', data)
//       .then(response => {
//         console.log('Marked as read:', response.data);
//         setReadSubDepartments(prev => new Set(prev).add(`${medicalFieldId}-${subDeptId}`));
//       })
//       .catch(error => {
//         console.error('Error marking as read:', error);
//       });
//   };




//   const markAsReadHelper = () =>{
//     markAsRead(email, selectedFieldId, selectedSubDeptId);
//   }


 


//   const selectedField = medicalFields.find(field => field.id === parseInt(selectedFieldId));
//   const selectedSubDept = subDepartments.find(subDept => subDept.id === parseInt(selectedSubDeptId));


//   console.log("Medical Field Name  " + selectedField?.name || 'None');
//   console.log("selected subdepartment name  " + selectedSubDept?.name || 'None');


//   return (
//     <div className="container bg-info-subtle mt-5">
//       <header className='text-center fixed-top fw-bold bg-dark text-white p-3'>Medical Field and Sub department</header>


//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <label className='email-label'>Your data will be saved to this Account</label>
//           <input
//             type="email"
//             value={email}
//             placeholder="Enter your email"
//             className="input-field"
//             disabled
//             required
//           />
//           <div className="d-flex align-items-center mb-3">
//             <div className="me-3" style={{ flex: 1 }}>
//               <label htmlFor="medical-field-select" className="form-label">Select Medical Field:</label>
//               <select
//                 id="medical-field-select"
//                 className="form-select"
//                 value={selectedFieldId}
//                 onChange={e => {
//                   setSelectedFieldId(e.target.value);
//                   setSelectedSubDeptId('');
//                   setDescription('');
//                 }}
//               >
//                 <option value="">-- Select a Medical Field --</option>
//                 {medicalFields.map(field => (
//                   <option key={field.id} value={field.id}>
//                     {field.name}
//                   </option>
//                 ))}
//               </select>
//             </div>


//             <div style={{ flex: 1 }}>
//               <label htmlFor="sub-dept-select" className="form-label">Select Sub-Department:</label>
//               <select
//                 id="sub-dept-select"
//                 className="form-select"
//                 value={selectedSubDeptId}
//                 onChange={e => setSelectedSubDeptId(e.target.value)}
//                 disabled={!subDepartments.length}
//               >
//                 <option value="">-- Select a Sub-Department --</option>
//                 {subDepartments.map(subDept => (
//                   <option
//                     key={subDept.id}
//                     value={subDept.id}
//                     style={{
//                       fontWeight: 'bold',
//                       color: readSubDepartments.has(`${selectedFieldId}-${subDept.id}`) ? 'green' : 'black',
//                     }}
//                   >
//                     {subDept.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>


//           {description && (
//             <div className="card">
//               <div className="card-header d-flex justify-content-between align-items-center">
//                 <button
//                   className="btn btn-outline-secondary btn-sm"
//                   onClick={handlePrevious}
//                   disabled={!selectedSubDeptId || subDepartments.findIndex(subDept => subDept.id === parseInt(selectedSubDeptId)) === 0}>
//                   &larr;
//                 </button>
//                 <h5 className="mb-0">Description</h5>
//                 <button
//                   className="btn btn-outline-secondary btn-sm"
//                   onClick={handleNext}
//                   disabled={!selectedSubDeptId || subDepartments.findIndex(subDept => subDept.id === parseInt(selectedSubDeptId)) === subDepartments.length - 1}>
//                   &rarr;
//                 </button>
//               </div>
//               <div {...swipeHandlers} className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                 <p
//                   id={`description-${selectedSubDeptId}`}
//                   className="card-text"
//                   style={{
//                     fontWeight: 'bold',
//                     color: readSubDepartments.has(`${selectedFieldId}-${selectedSubDeptId}`) ? 'green' : 'black',
//                   }}>
//                   {description}
//                 </p>
//               </div>
//               {/* <button className='btn btn-danger' onClick={() => { markAsReadHelper(email, selectedFieldId, selectedSubDeptId); }}>Mark as read</button> */}
//               {/* Display the selected Medical Field and Sub-Department names */}
//               {/* <div className="mt-3">
//                 <p><strong>Selected Medical Field:</strong> {selectedField?.name || 'None'}</p>
//                 <p><strong>Selected Sub-Department:</strong> {selectedSubDept?.name || 'None'}</p>
//               </div> */}


//               <AudioRecordingComponent email={email} medicalField={selectedField?.name} subDepartment={selectedSubDept?.name} markAsReadHelper={markAsReadHelper}/>


//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };


// export default MainPage;




import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSwipeable } from 'react-swipeable';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import AudioRecordingComponent from './AudioRecordingComponent';
import './MainPage.css';

const MainPage = () => {
  const [medicalFields, setMedicalFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [subDepartments, setSubDepartments] = useState([]);
  const [selectedSubDeptId, setSelectedSubDeptId] = useState('');
  const [description, setDescription] = useState('');
  const [readSubDepartments, setReadSubDepartments] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // Fetch medical field names
  useEffect(() => {
    axios.get('http://localhost:8080/api/medical-fields/names')
      .then(response => {
        setMedicalFields(response.data.map((name, index) => ({ id: index + 1, name })));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching medical field names:', error);
        setLoading(false);
      });
  }, []);

  // Fetch sub-departments based on selected medical field
  useEffect(() => {
    if (selectedFieldId) {
      axios.get(`http://localhost:8080/api/medical-fields/${selectedFieldId}/sub-departments`)
        .then(response => {
          setSubDepartments(response.data);
          setSelectedSubDeptId('');
          setDescription('');
        })
        .catch(error => {
          console.error('Error fetching sub-departments:', error);
        });
    }
  }, [selectedFieldId]);

  const getAgain = () => {
    axios.get('http://localhost:8080/api/get-all-read-status')
      .then(response => {
        const readStatusData = response.data;
        const readSubDepts = new Set();

        readStatusData.forEach(status => {
          if (status.read && status.email === email) {
            readSubDepts.add(`${status.medicalFieldId}-${status.subDeptId}`);
          }
        });

        setReadSubDepartments(readSubDepts);
      })
      .catch(error => {
        console.error('Error fetching read status data:', error);
      });
  };

  useEffect(() => {
    if (email) {
      getAgain();
    }
  }, [email]);

  useEffect(() => {
    if (selectedSubDeptId) {
      const selectedSubDept = subDepartments.find(subDept => subDept.id === parseInt(selectedSubDeptId));
      if (selectedSubDept) {
        setDescription(selectedSubDept.description);

        // Mark as read when a sub-department is selected
        //markAsRead(email, selectedFieldId, selectedSubDeptId);
      }
    }
  }, [selectedSubDeptId, subDepartments, email, selectedFieldId]);

  const handlePrevious = () => {
    if (selectedSubDeptId) {
      const currentIndex = subDepartments.findIndex(subDept => subDept.id === parseInt(selectedSubDeptId));
      if (currentIndex > 0) {
        setSelectedSubDeptId(subDepartments[currentIndex - 1].id);
      }
    }
  };

  const handleNext = () => {
    if (selectedSubDeptId) {
      const currentIndex = subDepartments.findIndex(subDept => subDept.id === parseInt(selectedSubDeptId));
      if (currentIndex < subDepartments.length - 1) {
        setSelectedSubDeptId(subDepartments[currentIndex + 1].id);
      }
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const markAsRead = (email, medicalFieldId, subDeptId) => {
    const data = {
      email: email,
      medicalFieldId: parseInt(medicalFieldId),
      subDeptId: parseInt(subDeptId),
      read: true,
    };

    axios.post('http://localhost:8080/api/mark-read', data)
      .then(response => {
        setReadSubDepartments(prev => new Set(prev).add(`${medicalFieldId}-${subDeptId}`));
      })
      .catch(error => {
        console.error('Error marking as read:', error);
      });
  };

  const markAsReadHelper = () => {
    markAsRead(email, selectedFieldId, selectedSubDeptId);
  };

  const selectedField = medicalFields.find(field => field.id === parseInt(selectedFieldId));
  const selectedSubDept = subDepartments.find(subDept => subDept.id === parseInt(selectedSubDeptId));

  return (
    <div className="container bg-info-subtle mt-5">
      <header className='text-center fixed-top fw-bold bg-dark text-white p-3'>Medical Field and Sub department</header>

      {loading ? (
        <Loader />
      ) : (
        <>
          <label className='email-label'>Your data will be saved to this Account</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            className="input-field"
            disabled
            required
          />
          <div className="d-flex align-items-center mb-3">
            <div className="me-3" style={{ flex: 1 }}>
              <label htmlFor="medical-field-select" className="form-label">Select Medical Field:</label>
              <select
                id="medical-field-select"
                className="form-select"
                value={selectedFieldId}
                onChange={e => {
                  setSelectedFieldId(e.target.value);
                  setSelectedSubDeptId('');
                  setDescription('');
                }}
              >
                <option value="">-- Select a Medical Field --</option>
                {medicalFields.map(field => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="sub-dept-select" className="form-label">Select Sub-Department:</label>
              <select
                id="sub-dept-select"
                className="form-select"
                value={selectedSubDeptId}
                onChange={e => setSelectedSubDeptId(e.target.value)}
                disabled={!subDepartments.length}
              >
                <option value="">-- Select a Sub-Department --</option>
                {subDepartments.map(subDept => (
                  <option
                    key={subDept.id}
                    value={subDept.id}
                    style={{
                      fontWeight: 'bold',
                      color: readSubDepartments.has(`${selectedFieldId}-${subDept.id}`) ? 'green' : 'black',
                    }}
                  >
                    {subDept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {description && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handlePrevious}
                  disabled={!selectedSubDeptId || subDepartments.findIndex(subDept => subDept.id === parseInt(selectedSubDeptId)) === 0}>
                  &larr;
                </button>
                <h5 className="mb-0">Description</h5>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleNext}
                  disabled={!selectedSubDeptId || subDepartments.findIndex(subDept => subDept.id === parseInt(selectedSubDeptId)) === subDepartments.length - 1}>
                  &rarr;
                </button>
              </div>
              <div {...swipeHandlers} className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <p
                  id={`description-${selectedSubDeptId}`}
                  className="card-text"
                  style={{
                    fontWeight: 'bold',
                    color: readSubDepartments.has(`${selectedFieldId}-${selectedSubDeptId}`) ? 'green' : 'black',
                  }}>
                  {description}
                </p>
              </div>
              <AudioRecordingComponent email={email} medicalField={selectedField?.name} subDepartment={selectedSubDept?.name} markAsReadHelper={markAsReadHelper} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MainPage;





