import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import {
  Actor,
  Circle,
  FullProduct,
  FullReview,
  Product,
  Review,
  Tag,
} from '@/types/entry';

const config = {
  apiKey: process.env.VUE_APP_apiKey,
  authDomain: process.env.VUE_APP_authDomain,
  databaseURL: process.env.VUE_APP_databaseURL,
  projectId: process.env.VUE_APP_projectId,
  storageBucket: process.env.VUE_APP_storageBucket,
  messagingSenderId: process.env.VUE_APP_messagingSenderId,
  appId: process.env.VUE_APP_appId,
  measurementId: process.env.VUE_APP_measurementId,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

type QuerySnapshot<T> = Promise<firebase.firestore.QuerySnapshot<T>>;
type DocSnapshot<T> = Promise<firebase.firestore.DocumentSnapshot<T>>;

export function fetchReviews() {
  return firebase
    .firestore()
    .collection('reviews')
    .get() as QuerySnapshot<Review>;
}

export function fetchProducts() {
  return firebase
    .firestore()
    .collection('products')
    .get() as QuerySnapshot<Product>;
}

export function fetchTags() {
  return firebase
    .firestore()
    .collection('tags')
    .get() as QuerySnapshot<Tag>;
}

export function fetchActors() {
  return firebase
    .firestore()
    .collection('actors')
    .get() as QuerySnapshot<Actor>;
}

export function fetchCircles() {
  return firebase
    .firestore()
    .collection('circles')
    .get() as QuerySnapshot<Circle>;
}

export function fetchReview(id: string) {
  return firebase
    .firestore()
    .collection('reviews')
    .doc(id)
    .get() as DocSnapshot<Review>;
}

export function fetchReviewBySlug(slug: string) {
  return firebase
    .firestore()
    .collection('reviews')
    .where('slug', '==', slug)
    .limit(1)
    .get()
    .then(d => d.docs[0]) as DocSnapshot<Review>;
}

export function fetchProduct(id: string) {
  return firebase
    .firestore()
    .collection('products')
    .doc(id)
    .get() as DocSnapshot<Product>;
}

export function fetchProductBySlug(slug: string) {
  return firebase
    .firestore()
    .collection('products')
    .where('slug', '==', slug)
    .limit(1)
    .get()
    .then(d => d.docs[0]) as DocSnapshot<Product>;
}

export function fetchProductsIn(ids: string[]) {
  return firebase
    .firestore()
    .collection('products')
    .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
    .get() as QuerySnapshot<Product>;
}

export function fetchTag(id: string) {
  return firebase
    .firestore()
    .collection('tags')
    .doc(id)
    .get() as DocSnapshot<Tag>;
}

export function fetchTagBySlug(slug: string) {
  return firebase
    .firestore()
    .collection('tags')
    .where('slug', '==', slug)
    .limit(1)
    .get()
    .then(d => d.docs[0]) as DocSnapshot<Tag>;
}

export function fetchTagsIn(ids: string[]) {
  return firebase
    .firestore()
    .collection('tags')
    .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
    .get() as QuerySnapshot<Tag>;
}

export function fetchActor(id: string) {
  return firebase
    .firestore()
    .collection('actors')
    .doc(id)
    .get() as DocSnapshot<Actor>;
}

export function fetchActorBySlug(slug: string) {
  return firebase
    .firestore()
    .collection('actors')
    .where('slug', '==', slug)
    .limit(1)
    .get()
    .then(d => d.docs[0]) as DocSnapshot<Actor>;
}

export function fetchActorsIn(ids: string[]) {
  return firebase
    .firestore()
    .collection('actors')
    .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
    .get() as QuerySnapshot<Actor>;
}

export function fetchCircle(id: string) {
  return firebase
    .firestore()
    .collection('circles')
    .doc(id)
    .get() as DocSnapshot<Circle>;
}

export function fetchCircleBySlug(slug: string) {
  return firebase
    .firestore()
    .collection('circles')
    .where('slug', '==', slug)
    .limit(1)
    .get()
    .then(d => d.docs[0]) as DocSnapshot<Circle>;
}

export function fetchActorsReview(actorId: string) {
  const actorRef = firebase
    .firestore()
    .collection('actors')
    .doc(actorId);
  return firebase
    .firestore()
    .collection('reviews')
    .where('actors', 'array-contains', actorRef)
    .get() as QuerySnapshot<Review>;
}

export function fetchReviewContainsTag(tagId: string) {
  const tagRef = firebase
    .firestore()
    .collection('tags')
    .doc(tagId);
  return firebase
    .firestore()
    .collection('reviews')
    .where('tags', 'array-contains', tagRef)
    .get() as QuerySnapshot<Review>;
}

export function fetchCirclesReview(circleId: string) {
  const circleRef = firebase
    .firestore()
    .collection('circles')
    .doc(circleId);
  return firebase
    .firestore()
    .collection('reviews')
    .where('circle', '==', circleRef)
    .get() as QuerySnapshot<Review>;
}

export function assembleFullProduct(product: Product) {
  const circle = fetchCircle(product.circle.id);
  const tags = fetchTagsIn(product.tags.map(d => d.id));
  const actors = fetchActorsIn(product.actors.map(d => d.id));
  return Promise.all([Promise.resolve(product), circle, tags, actors]).then(
    results => {
      const [rawProduct, circle, tags, actors] = results;
      const product: FullProduct = {
        name: rawProduct.name,
        slug: rawProduct.slug,
        img: rawProduct.img,
        count: rawProduct.count,
        soundScore: rawProduct.soundScore,
        actorScore: rawProduct.actorScore,
        costPerformanceScore: rawProduct.costPerformanceScore,
        featureScore: rawProduct.featureScore,
        genres: rawProduct.genres,
        circle: circle.data()!,
        tags: tags.docs.map(d => d.data()),
        actors: actors.docs.map(d => d.data()),
      };
      return product;
    }
  );
}

export function assembleFullReview(review: Review) {
  const productIds = review.products.map(e => e.id);
  return fetchProductsIn(productIds).then(result => {
    const dataList = result.docs.map(d => d.data());
    return Promise.all(
      dataList.map(data => {
        return assembleFullProduct(data);
      })
    ).then(products => {
      return {
        title: review.title,
        description: review.description,
        body: review.body,
        author: review.author,
        slug: review.slug,
        public: review.public,
        products,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      } as FullReview;
    });
  });
}

export function fetchFullProducts() {
  return fetchProducts().then(result => {
    return Promise.all(result.docs.map(d => assembleFullProduct(d.data())));
  });
}

export function fetchFullProductBySlug(slug: string) {
  return fetchProductBySlug(slug).then(result => {
    const data = result.data();
    if (!data) {
      return null;
    }
    return assembleFullProduct(data);
  });
}

export function fetchFullReviews() {
  return fetchReviews().then(result => {
    return Promise.all(result.docs.map(d => assembleFullReview(d.data())));
  });
}

export function fetchFullReview(id: string) {
  return fetchReview(id).then(result => {
    const data = result.data();
    if (!data) {
      return null;
    }
    return assembleFullReview(data);
  });
}

export function fetchFullReviewBySlug(slug: string) {
  return fetchReviewBySlug(slug).then(result => {
    const data = result.data();
    if (!data) {
      return null;
    }
    return assembleFullReview(data);
  });
}

export function fetchHeaderImages() {
  return firebase
    .storage()
    .ref()
    .child('media')
    .child('header')
    .listAll()
    .then(result => {
      return Promise.all(
        result.prefixes.map(itemRef => {
          return itemRef.name;
        })
      );
    });
}

export function fetchNormalImages(): Promise<string[]> {
  return firebase
    .storage()
    .ref()
    .child('media')
    .child('image')
    .listAll()
    .then(result => {
      return Promise.all(
        result.items.map(itemRef => {
          return itemRef.getDownloadURL();
        })
      );
    });
}

export function getNormalImageUrl(name: string) {
  return `https://firebasestorage.googleapis.com/v0/b/sa2taka-asmr.appspot.com/o/media%2Fimage%2F${name}?alt=media`;
}

export function getHeaderImageUrl(
  name: string,
  file: 'image.png' | 'image.webp' | 'thumbnail.png' | 'thumbnail.webp'
) {
  return `https://firebasestorage.googleapis.com/v0/b/sa2taka-asmr.appspot.com/o/media%2Fheader%2F${name}%2F${file}?alt=media`;
}

export function addTag(tag: Tag) {
  return firebase
    .firestore()
    .collection('tags')
    .doc(tag.slug)
    .set(tag);
}

export function updateTag(id: string, tag: Tag) {
  return firebase
    .firestore()
    .collection('tags')
    .doc(id)
    .set(tag);
}

export function deleteTag(id: string) {
  return firebase
    .firestore()
    .collection('tags')
    .doc(id)
    .delete();
}

export function addActor(actor: Actor) {
  return firebase
    .firestore()
    .collection('actors')
    .doc(actor.slug)
    .set(actor);
}

export function updateActor(id: string, actor: Actor) {
  return firebase
    .firestore()
    .collection('actors')
    .doc(id)
    .set(actor);
}

export function deleteActor(id: string) {
  return firebase
    .firestore()
    .collection('actors')
    .doc(id)
    .delete();
}

export function addCircle(circle: Circle) {
  return firebase
    .firestore()
    .collection('circles')
    .doc(circle.slug)
    .set(circle);
}

export function updateCircle(id: string, circle: Circle) {
  return firebase
    .firestore()
    .collection('circles')
    .doc(id)
    .set(circle);
}

export function deleteCircle(id: string) {
  return firebase
    .firestore()
    .collection('circles')
    .doc(id)
    .delete();
}

export function addProduct(product: Product) {
  return firebase
    .firestore()
    .collection('products')
    .doc(product.slug)
    .set(product);
}

export function updateProduct(id: string, product: Product) {
  return firebase
    .firestore()
    .collection('products')
    .doc(id)
    .set(product);
}

export function deleteProduct(id: string) {
  return firebase
    .firestore()
    .collection('products')
    .doc(id)
    .delete();
}

export function addReview(review: Review) {
  const data = {
    ...review,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  return firebase
    .firestore()
    .collection('reviews')
    .doc(review.slug)
    .set(data);
}

export function updateReview(id: string, review: Review) {
  const data = {
    ...review,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  return firebase
    .firestore()
    .collection('reviews')
    .doc(id)
    .set(data);
}

export function deleteReview(id: string) {
  return firebase
    .firestore()
    .collection('reviews')
    .doc(id)
    .delete();
}

export function updateHeaderImage(
  folderName: string,
  filename: string,
  img: File | Blob
) {
  return firebase
    .storage()
    .ref()
    .child('media')
    .child('header')
    .child(folderName)
    .child(filename)
    .put(img);
}

export function updateNormalImage(filename: string, img: File | Blob) {
  return firebase
    .storage()
    .ref()
    .child('media')
    .child('image')
    .child(filename)
    .put(img);
}

export function deleteImage(name: string, type: string) {
  if (type === 'header') {
    return firebase
      .storage()
      .ref()
      .child('media')
      .child('header')
      .child(name)
      .listAll()
      .then(file => Promise.all(file.items.map(item => item.delete())));
  } else if (type === 'normal') {
    return firebase
      .storage()
      .ref()
      .child('media')
      .child('image')
      .child(name)
      .delete();
  }
  return Promise.resolve();
}

export default firebase;
