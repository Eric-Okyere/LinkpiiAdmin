const Card = ({ children, className = '', hover = false, as: Tag = 'div', ...rest }) => (
  <Tag
    className={`rounded-2xl border border-ink-100 bg-white shadow-card ${
      hover ? 'transition-shadow hover:shadow-card-hover' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </Tag>
);

export default Card;
