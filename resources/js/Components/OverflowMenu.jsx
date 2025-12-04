import React, { useState, useRef, useEffect } from 'react';
import MoreButton from '@/Components/Buttons/MoreButton';
import PropTypes from 'prop-types';

function OverflowMenu({ items }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const menuStyle = {
        display: 'inline-flex',
        padding: '10px 0px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: '6px',
        background: 'white',
        boxShadow: '0px 1px 3px 0px rgba(166, 175, 195, 0.40)',
    };

    const itemStyle = {
        display: 'flex',
        width: '210px',
        padding: '8px 20px',
        alignItems: 'center',
        gap: '10px',
        color: '#374151',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '26px',
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <MoreButton style={{ border: isOpen ? '1px solid #F79222' : 'none', borderRadius: '8px'}} onClick={handleToggle}></MoreButton>
            {isOpen && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        zIndex: 50,
                        ...menuStyle,
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                ':hover': { backgroundColor: 'rgba(247, 146, 34, 0.05)', color: '#F79222' },
                                ...itemStyle
                            }}
                            onClick={() => {
                                item.onClick();
                                setIsOpen(false);
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

OverflowMenu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ).isRequired,
};

export default OverflowMenu;