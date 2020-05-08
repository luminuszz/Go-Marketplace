/* eslint-disable prefer-const */
import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function setStorageProducts(): Promise<void> {
      await AsyncStorage.setItem(
        '@GoMarktPlace:products',
        JSON.stringify(products),
      );
    }
    setStorageProducts();
  }, [products]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storageProducts = await AsyncStorage.getItem(
        '@GoMarktPlace:products',
      );
      if (storageProducts) {
        setProducts(JSON.parse(storageProducts));
      }
    }
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const { id } = product;
      const findProduct = products.find(arrayProduct => arrayProduct.id === id);
      if (findProduct) {
        const newProduct = {
          ...findProduct,
          quantity: findProduct.quantity + 1,
        };
        const newProducts = products.filter(
          array => array.id !== findProduct?.id,
        );
        setProducts([...newProducts, newProduct]);

        return;
      }
      const newProduct = { ...product, quantity: 1 };
      setProducts([...products, newProduct]);
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const product = products.find(arrayProduct => arrayProduct.id === id);
      if (product) {
        const newProduct: Product = {
          ...product,
          quantity: product.quantity += 1,
        };
        const newProducts = products.filter(array => array.id !== product.id);

        setProducts([...newProducts, newProduct]);
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const product = products.find(arrayProduct => arrayProduct.id === id);
      if (product) {
        if (product.quantity === 1) {
          const newproducts = products.filter(item => item.id !== product.id);
          setProducts(newproducts);
          return;
        }
        const newProduct: Product = {
          ...product,
          quantity: product.quantity -= 1,
        };
        const newProducts = products.filter(array => array.id !== product.id);

        setProducts([...newProducts, newProduct]);
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
