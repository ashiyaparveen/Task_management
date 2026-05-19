import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isMock } from '../firebase/config';
import { useAuth } from '../context/AuthContext';


export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPendingConnection, setIsPendingConnection] = useState(false);

  // Sync tasks logic
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      setIsPendingConnection(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsPendingConnection(false);

    // Diagnostic timeout to detect if Firestore is not created or enabled
    const connectionTimer = setTimeout(() => {
      setIsPendingConnection(true);
    }, 5000); // Flag pending connection after 5 seconds

    // Mock Mode local storage synchronization
    if (isMock) {
      clearTimeout(connectionTimer);
      try {
        let storedTasks = localStorage.getItem('taskflow_mock_tasks');
        if (!storedTasks) {
          const sampleTasks = [
            {
              id: 'task_sample_1',
              title: 'Review Technical Assessment requirements',
              description: 'Examine layout responsiveness, functional state updates, Google Auth integrations, and project cleanliness.',
              status: 'Complete',
              userId: user.uid,
              createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            },
            {
              id: 'task_sample_2',
              title: 'Test Google Auth and Firestore connections',
              description: 'Configure active web client keys in the .env file and verify real-time updates and database permissions rules.',
              status: 'In Progress',
              userId: user.uid,
              createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
            },
            {
              id: 'task_sample_3',
              title: 'Build production distribution bundle',
              description: 'Execute npm run build to verify zero compile or import errors in CSS and JavaScript chunks.',
              status: 'Planned',
              userId: user.uid,
              createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
            }
          ];
          localStorage.setItem('taskflow_mock_tasks', JSON.stringify(sampleTasks));
          storedTasks = JSON.stringify(sampleTasks);
        }

        const allTasks = JSON.parse(storedTasks);
        const userTasks = allTasks
          .filter((t) => t.userId === user.uid)
          .map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));

        userTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setTasks(userTasks);
      } catch (err) {
        console.error("Local mock storage sync failed:", err);
        setError("Failed to sync mock local storage database.");
      } finally {
        setLoading(false);
      }
      return () => {};
    }

    // Real Firebase Firestore Synchronization
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        clearTimeout(connectionTimer);
        setIsPendingConnection(false);
        const fetchedTasks = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          };
        });

        fetchedTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        clearTimeout(connectionTimer);
        setIsPendingConnection(false);
        console.error("Firestore real-time sync error:", err);
        setError("Failed to fetch tasks. Please check database permissions or enable Firestore.");
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(connectionTimer);
      unsubscribe();
    };
  }, [user]);


  // Create a new task
  const createTask = async (title, description = '') => {
    if (!user) throw new Error("Authentication required to create tasks");
    if (!title.trim()) throw new Error("Task title is required");

    // Local Storage Mock Creation
    if (isMock) {
      await new Promise((resolve) => setTimeout(resolve, 200)); // micro delay
      try {
        const newTask = {
          id: 'task_' + Date.now(),
          title: title.trim(),
          description: description.trim(),
          status: 'Planned',
          userId: user.uid,
          createdAt: new Date().toISOString(),
        };

        const allTasks = JSON.parse(localStorage.getItem('taskflow_mock_tasks') || '[]');
        allTasks.unshift(newTask);
        localStorage.setItem('taskflow_mock_tasks', JSON.stringify(allTasks));

        // Update active hook state
        const updatedUserTasks = allTasks
          .filter((t) => t.userId === user.uid)
          .map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
        updatedUserTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setTasks(updatedUserTasks);
        return;
      } catch (err) {
        console.error("Mock task creation failed:", err);
        throw new Error("Failed to create mock task.");
      }
    }

    // Real Firestore Creation
    try {
      const tasksRef = collection(db, 'tasks');
      await addDoc(tasksRef, {
        title: title.trim(),
        description: description.trim(),
        status: 'Planned',
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error creating task:", err);
      throw new Error("Failed to create task. Please try again.");
    }
  };

  // Update status of an existing task
  const updateTaskStatus = async (taskId, newStatus) => {
    if (!user) throw new Error("Authentication required to update tasks");
    const allowedStatuses = ['Planned', 'In Progress', 'Complete'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error("Invalid status type");
    }

    // Local Storage Mock Update
    if (isMock) {
      await new Promise((resolve) => setTimeout(resolve, 150)); // micro delay
      try {
        const allTasks = JSON.parse(localStorage.getItem('taskflow_mock_tasks') || '[]');
        const updatedAllTasks = allTasks.map((t) => 
          t.id === taskId ? { ...t, status: newStatus } : t
        );
        localStorage.setItem('taskflow_mock_tasks', JSON.stringify(updatedAllTasks));

        // Update active hook state
        const updatedUserTasks = updatedAllTasks
          .filter((t) => t.userId === user.uid)
          .map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
        updatedUserTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setTasks(updatedUserTasks);
        return;
      } catch (err) {
        console.error("Mock status update failed:", err);
        throw new Error("Failed to update status of mock task.");
      }
    }

    // Real Firestore Update
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating task status:", err);
      throw new Error("Failed to update task status. Please try again.");
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTaskStatus,
  };
};

