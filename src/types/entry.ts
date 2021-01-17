import firebase from 'firebase';

export interface FullReview extends firebase.firestore.DocumentData {
  title: string;
  description: string;
  body: string;
  slug: string;
  author: string;
  public: boolean;
  products: FullProduct[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

export interface FullProduct extends firebase.firestore.DocumentData {
  name: string;
  slug: string;
  img: string;
  tags: Tag[];
  circle: Circle;
  actors: Actor[];
  genres: string[];
  count: number;
  soundScore: number;
  actorScore: number;
  costPerformanceScore: number;
  featureScore: number;
}

export interface Review extends firebase.firestore.DocumentData {
  title: string;
  description: string;
  body: string;
  author: string;
  slug: string;
  public: boolean;
  products: firebase.firestore.DocumentReference[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

export interface Product extends firebase.firestore.DocumentData {
  name: string;
  slug: string;
  img: string;
  tags: firebase.firestore.DocumentReference[];
  circle: firebase.firestore.DocumentReference;
  actors: firebase.firestore.DocumentReference[];
  count: number;
  genres: string[];
  soundScore: number;
  actorScore: number;
  costPerformanceScore: number;
  featureScore: number;
}

export interface Tag extends firebase.firestore.DocumentData {
  name: string;
  slug: string;
  count: number;
}

export interface Circle extends firebase.firestore.DocumentData {
  name: string;
  slug: string;
  info: SocialInfo[];
  count: number;
}

export interface Actor extends firebase.firestore.DocumentData {
  name: string;
  slug: string;
  count: number;
  info: SocialInfo[];
}

export interface SocialInfo {
  social: string;
  name: string;
  link: string;
}

export interface Comment extends firebase.firestore.DocumentData {
  username: string;
  text: string;
  onlyAdministrator: string;
}
