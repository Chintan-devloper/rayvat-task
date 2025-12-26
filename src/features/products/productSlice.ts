import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
}

interface ProductState {
    items: Product[];
    total: number;
    error: string | null;
}

const initialState: ProductState = {
    items: [],
    total: 0,
    error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await fetch('https://dummyjson.com/products?limit=0');
    const data = await response.json();
    return { products: data.products, total: data.total };
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Omit<Product, 'id'>>) => {
            const maxId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) : 0;
            const newProduct = {
                ...action.payload,
                id: maxId + 1,
            };
            state.items.unshift(newProduct);
            state.total += 1;
        },
        updateProduct: (state, action: PayloadAction<Partial<Product> & { id: number }>) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        },
        deleteProduct: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((product) => product.id !== action.payload);
            state.total -= 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload.products;
                state.total = action.payload.total;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch products';
            });
    },
});

export const { addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
