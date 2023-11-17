// pages/DeliveryPersons.tsx

import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/adminNavbar';
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import style from '../styles/vendor.module.css'

import toast, { Toaster } from 'react-hot-toast';

const DeliveryPersons: React.FC = () => {
  const [deliveryPersons, setDeliveryPersons]:any = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fetchData = async () => {
    const deliveryPersonsCollection = collection(db, 'deliveryPersons');
    const querySnapshot = await getDocs(deliveryPersonsCollection);
    const data:any = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDeliveryPersons(data);
  };

  useEffect(() => {
   
    if(deliveryPersons.length === 0){
      
        fetchData();

    }
  });

  const handleAdd = async () => {
  try {
    toast.loading('Adding delivery person...');
    if (!name || !username || !password) {
        toast.error('Please fill in all fields.');
        return;
      }
  // check username already exists
    const deliveryPersonsCollection = collection(db, 'deliveryPersons');
    const querySnapshot = await getDocs(deliveryPersonsCollection);
    const data:any = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const checkUsername :any= data.filter((deliveryPerson:any) => deliveryPerson.username === username);
    if (checkUsername.length > 0) {
        toast.error('Username already exists.');
        return;
      }
      await addDoc(collection(db, 'deliveryPersons'), {
        name,
        username,
        password,
      });
  toast.dismiss()
      toast.success('Delivery person added successfully.');
      clearForm();
      fetchData()
  } catch (error:any) {
  toast.dismiss()

    toast.error(error.message);
  }
  };

  const handleEdit = async () => {
    toast.loading('Updating delivery person...');
    if (!name || !username || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    await updateDoc(doc(db, 'deliveryPersons', editingId), {
      name,
      username,
      password,
    });
    toast.dismiss()

    toast.success('Delivery person updated successfully.');
    clearForm();
    fetchData()

  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this delivery person?')) {
        toast.loading('Deleting delivery person...');
        
    await deleteDoc(doc(db, 'deliveryPersons', id));
    toast.dismiss()
    fetchData()
      toast.success('Delivery person deleted successfully.');
    }
  };

  const clearForm = () => {
    setName('');
    setUsername('');
    setPassword('');
    setEditingId('');
    setIsEditing(false);
  };

  const handleEditClick = (deliveryPerson: any) => {
    setName(deliveryPerson.name);
    setUsername(deliveryPerson.username);
    setPassword(deliveryPerson.password);
    setEditingId(deliveryPerson.id);
    setIsEditing(true);
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5 pt-5">
        <Toaster />
        
     <div className='flex gap-2 justify-center  flex-wrap'>
  
        <div className="mb-4">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            className='border-2 border-black rounded-md mx-2 p-1'
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            className='border-2 border-black rounded-md mx-2 p-1'

            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password:</label>
          <input
            type={isEditing ? "text":"text"}
            id="password"
            name="password"
            className='border-2 border-black rounded-md mx-2 p-1 '

            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          {isEditing ? (
            <button className="btn btn-primary" onClick={handleEdit}>
              Save Changes
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleAdd}>
              Add Delivery Person
            </button>
          )}
        </div>
     </div>
        <table className="table bordered shadow-sm responsive hover">
          <thead className={`${style.table_head}`}>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryPersons.map((deliveryPerson: any) => (
              <tr key={deliveryPerson.id}>
                <td>{deliveryPerson.name}</td>
                <td>{deliveryPerson.username}</td>
                <td>{deliveryPerson.password}</td>
                <td className='flex gap-2'>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditClick(deliveryPerson)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(deliveryPerson.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DeliveryPersons;
