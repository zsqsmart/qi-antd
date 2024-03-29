/**
 * 二级菜单
 */

import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MenuItemProps } from '.';
import { Icon } from '../icon';
import MenuContext from './menu-context';
import { Transition } from '../transition';

export interface SubMenuProps extends React.HTMLAttributes<HTMLLIElement> {
  eventKey?: string;
  title: string;
}

const SubMenu: React.FC<SubMenuProps> = (props) => {
  const { title, className, children } = props;
  const [opened, setOpened] = useState(false);
  const { mode } = useContext(MenuContext);
  const timerRef = useRef<NodeJS.Timeout>();
  const cls = classNames('qi-sub-menu', className, {
    opened,
  });
  const clickEvents = useMemo(() => {
    if (mode === 'vertical') {
      return {
        onClick: () => {
          setOpened((prev) => !prev);
        },
      };
    }
  }, [mode]);

  const mouseHandler = useCallback((toggle: boolean) => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setOpened(toggle);
    }, 300);
  }, []);

  const mouseEvents = useMemo(() => {
    if (mode === 'horizontal') {
      return {
        onMouseEnter: () => {
          mouseHandler(true);
        },
        onMouseLeave: () => {
          mouseHandler(false);
        },
      };
    }
  }, [mode, mouseHandler]);

  const renderChildren = () => {
    const childComponents = React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return null;
      const childElement =
        child as React.FunctionComponentElement<MenuItemProps>;
      const { name } = childElement.type;
      if (name !== 'MenuItem') {
        console.error(
          'Warning: SubMenu has a child witch is not MenuItem component',
        );
        return null;
      }
      const { key } = childElement;
      const eventKey = String(key != null ? key : index);
      const clonedProps = {
        key: eventKey,
        eventKey,
      };
      return React.cloneElement(child, clonedProps);
    });
    return <ul className="qi-sub-menu-body">{childComponents}</ul>;
  };

  return (
    <li className={cls} {...mouseEvents}>
      <div className="qi-sub-menu-title" {...clickEvents}>
        <span>{title}</span>
        <Icon icon="angle-down" className="qi-sub-menu-title-suffix" />
      </div>
      <Transition in={opened} timeout={300} animation="zoom-in-top">
        {renderChildren()}
      </Transition>
    </li>
  );
};

export default SubMenu;
