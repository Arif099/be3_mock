import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPost, setShowPost] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowPost(false)
        try {
            const docRef = await addDoc(collection(db, 'posts'), {
                title,
                content,
                createdAt: new Date(),
            });

            // Optional: Retrieve the created post
            const createdPost = await getDoc(doc(db, 'posts', docRef.id));
            setPost(createdPost.data());

            setTitle('');
            setContent('');
        } catch (err) {
            console.error("Error adding document: ", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label><br />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label><br />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
            <br />
            {post && (
                <button type='submit' onClick={() => setShowPost(prev => !prev)} >
                    {showPost ? 'Hide Created Posts' : 'Show Created Posts'}
                </button>
            )}
            {showPost && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Post Created:</h3>
                    <p><strong>Title:</strong> {post.title}</p>
                    <p><strong>Content:</strong> {post.content}</p>
                </div>
            )}
        </div>
    );
};
