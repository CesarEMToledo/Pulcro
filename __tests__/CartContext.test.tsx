import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartProvider, useCart, CartItem } from '../contexts/CartContext';

const item: Omit<CartItem, 'quantity'> = {
  id: 'wash-1',
  name: 'Wash & Fold',
  detail: '5kg load',
  price: 12,
  image: { uri: 'test' },
};

function renderCart() {
  return renderHook(() => useCart(), { wrapper: CartProvider });
}

describe('CartContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts empty', async () => {
    const { result } = await renderCart();
    expect(result.current.items).toEqual([]);
  });

  it('adds a new item with default quantity 1', async () => {
    const { result } = await renderCart();
    await act(() => result.current.addItem(item));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ id: 'wash-1', quantity: 1 });
  });

  it('merges quantities when the same item is added again', async () => {
    const { result } = await renderCart();
    await act(() => result.current.addItem(item));
    await act(() => result.current.addItem(item, { quantity: 2 }));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('replaces quantity instead of merging when replace is set', async () => {
    const { result } = await renderCart();
    await act(() => result.current.addItem(item, { quantity: 2 }));
    await act(() => result.current.addItem(item, { quantity: 5, replace: true }));
    expect(result.current.items[0].quantity).toBe(5);
  });

  it('removes the item entirely when updateQuantity drops to 0', async () => {
    const { result } = await renderCart();
    await act(() => result.current.addItem(item, { quantity: 2 }));
    await act(() => result.current.updateQuantity('wash-1', 0));
    expect(result.current.items).toEqual([]);
  });
});
