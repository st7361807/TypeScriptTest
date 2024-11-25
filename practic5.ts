type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description?: string;
  };
  
  type Electronics = BaseProduct & {
    category: 'electronics';
    brand: string;
    warrantyPeriod: string;
  };
  
  type Clothing = BaseProduct & {
    category: 'clothing';
    size: string;
    material: string;
  };
  
  const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    return products.find(product => product.id === id);
  };
  
  const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    return products.filter(product => product.price <= maxPrice);
  };
  
  type CartItem<T> = {
    product: T;
    quantity: number;
  };
  
  const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
  ): CartItem<T>[] => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    return cart;
  };
  
  const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };
  
  const electronics: Electronics[] = [
    { id: 1, name: 'Телефон', price: 10000, category: 'electronics', brand: 'Samsung', warrantyPeriod: '2 роки' },
    { id: 2, name: 'Ноутбук', price: 25000, category: 'electronics', brand: 'Dell', warrantyPeriod: '1 рік' },
  ];
  
  const clothing: Clothing[] = [
    { id: 3, name: 'Футболка', price: 500, category: 'clothing', size: 'L', material: 'Бавовна' },
    { id: 4, name: 'Джинси', price: 1200, category: 'clothing', size: 'M', material: 'Денім' },
  ];
  
  const phone = findProduct(electronics, 1);
  console.log('Знайдений товар:', phone);
  
  const affordableClothing = filterByPrice(clothing, 1000);
  console.log('Доступний одяг:', affordableClothing);
  
  let cart: CartItem<BaseProduct>[] = [];
  if (phone) {
    cart = addToCart(cart, phone, 1);
  }
  console.log('Кошик після додавання телефону:', cart);
  
  const total = calculateTotal(cart);
  console.log('Загальна вартість:', total);
  