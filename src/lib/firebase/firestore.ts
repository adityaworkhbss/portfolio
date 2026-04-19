import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import type { About, Project, Experience, Blog, ContactMessage } from "../types";
import { calculateReadingTime } from "../utils";

// ─── About ──────────────────────────────────────────────

export async function getAbout(): Promise<About | null> {
  try {
    const docRef = doc(db, "about", "profile");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as About;
    }
    return null;
  } catch (error) {
    console.error("Error fetching about:", error);
    return null;
  }
}

export async function updateAbout(data: Partial<About>): Promise<void> {
  const docRef = doc(db, "about", "profile");
  await setDoc(docRef, data, { merge: true });
}

// ─── Projects ───────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  try {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }) as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }) as Project[];
    return projects.filter((p) => p.featured === true);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Project;
    }
    return null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProject(id: string, data: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>): Promise<void> {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// ─── Experience ─────────────────────────────────────────

export async function getExperiences(): Promise<Experience[]> {
  try {
    const q = query(collection(db, "experiences"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Experience[];
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export async function createExperience(data: Omit<Experience, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "experiences"), data);
  return docRef.id;
}

export async function updateExperience(id: string, data: Partial<Experience>): Promise<void> {
  await updateDoc(doc(db, "experiences", id), data);
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, "experiences", id));
}

// ─── Blogs ──────────────────────────────────────────────

export async function getBlogs(publishedOnly = true): Promise<Blog[]> {
  try {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const blogs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }) as Blog[];
    
    if (publishedOnly) {
      return blogs.filter((b) => b.published === true);
    }
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const q = query(collection(db, "blogs"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const blogDoc = snapshot.docs[0];
    const data = blogDoc.data();
    return { 
      id: blogDoc.id, 
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Blog;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}

export async function createBlog(data: Omit<Blog, "id" | "readingTime" | "createdAt" | "updatedAt">): Promise<string> {
  const readingTime = calculateReadingTime(data.content);
  const docRef = await addDoc(collection(db, "blogs"), {
    ...data,
    readingTime,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateBlog(id: string, data: Partial<Omit<Blog, "id" | "createdAt" | "updatedAt">>): Promise<void> {
  const updateData: Record<string, unknown> = { ...data, updatedAt: Timestamp.now() };
  if (data.content) {
    updateData.readingTime = calculateReadingTime(data.content);
  }
  await updateDoc(doc(db, "blogs", id), updateData);
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogs", id));
}

// ─── Contact Messages ──────────────────────────────────

export async function submitContactMessage(
  data: Omit<ContactMessage, "id" | "createdAt" | "read">
): Promise<string> {
  const docRef = await addDoc(collection(db, "messages"), {
    ...data,
    createdAt: Timestamp.now(),
    read: false,
  });
  return docRef.id;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }) as ContactMessage[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function updateContactMessage(id: string, data: Partial<ContactMessage>): Promise<void> {
  await updateDoc(doc(db, "messages", id), data);
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "messages", id));
}
