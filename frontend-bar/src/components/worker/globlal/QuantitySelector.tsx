import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (value: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, setQuantity }) => {
  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="quantity-selector">
      <button className="quantity-button" onClick={decrement}>
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        className="quantity-input"
      />
      <button className="quantity-button" onClick={increment}>
        +
      </button>
    </div>
  );
};

export default QuantitySelector;