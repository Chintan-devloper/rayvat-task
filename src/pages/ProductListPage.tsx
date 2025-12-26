import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts, addProduct, updateProduct, deleteProduct, type Product } from '../features/products/productSlice';

const ProductListPage = () => {
    const dispatch = useAppDispatch();
    const { items, total, error } = useAppSelector((state) => state.products);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ title: string; price: string; category: string }>({
        title: '',
        price: '',
        category: '',
    });

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch]);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const handleEdit = (product: Product) => {
        setFormData({
            title: product.title,
            price: product.price.toString(),
            category: product.category,
        });
        setCurrentId(product.id);
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData({ title: '', price: '', category: '' });
        setCurrentId(null);
        setIsEditing(false);
        setIsFormOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title && formData.price) {
            if (isEditing && currentId) {
                dispatch(updateProduct({
                    id: currentId,
                    title: formData.title,
                    price: Number(formData.price),
                    category: formData.category || 'General',
                }));
            } else {
                dispatch(addProduct({
                    title: formData.title,
                    price: Number(formData.price),
                    category: formData.category || 'General',
                    description: 'New product description',
                    discountPercentage: 0,
                    rating: 0,
                    stock: 10,
                    brand: 'Generic',
                }));
            }
            resetForm();
        }
    };

    if (error) {
        return (
            <div className="text-center text-danger" style={{ padding: '2rem' }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Products</h1>
                        <p className="text-muted">
                            Total Records: <strong className="text-primary">{total}</strong>
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            if (isFormOpen) resetForm();
                            else setIsFormOpen(true);
                        }}
                    >
                        {isFormOpen ? 'Cancel' : 'Add Product'}
                    </button>
                </div>

                {isFormOpen && (
                    <form onSubmit={handleSubmit} className="product-form">
                        <h3 className="font-semibold mb-4" style={{ fontSize: '1.125rem' }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                        <div className="form-grid">
                            <div>
                                <label className="mb-2 font-medium">Title</label>
                                <input
                                    className="input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="Product Name"
                                />
                            </div>
                            <div>
                                <label className="mb-2 font-medium">Price</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="mb-2 font-medium">Category</label>
                                <input
                                    className="input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Category (Optional)"
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary">{isEditing ? 'Update Product' : 'Save Product'}</button>
                        </div>
                    </form>
                )}
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th className="table-th">ID</th>
                                <th className="table-th">Title</th>
                                <th className="table-th">Brand</th>
                                <th className="table-th">Category</th>
                                <th className="table-th">Price</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...items].sort((a, b) => b.id - a.id).map((product) => (
                                <tr key={product.id} className="table-row">
                                    <td className="table-td">{product.id}</td>
                                    <td className="table-td font-medium">{product.title}</td>
                                    <td className="table-td text-muted">{product.brand || 'N/A'}</td>
                                    <td className="table-td">
                                        <span className="category">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="table-td font-semibold">₹ {product.price}</td>
                                    <td className="table-td text-right">
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
