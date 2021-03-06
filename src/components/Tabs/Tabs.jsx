import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import { animated, useTransition } from "react-spring";
import { classNames } from "../../utils";
import styles from "./styles.css";
import Dropdown from "../Dropdown/Dropdown.jsx";
import DropdownItem from "../Dropdown/DropdownItem.jsx";

const TabDropdownTrigger = ({
  onClick,
  open,
  ArrowComponent,
  childrenTabs,
  activeTabIndex
}) => (
  <div className={styles.activeDropdownTabWrapper}>
    {React.Children.map(childrenTabs, (child, index) => {
      if (index === activeTabIndex) {
        return React.cloneElement(child, {
          onClick: onClick,
          className: styles.activeDropdownTabClass,
          isActive: true,
          mode: "dropdown"
        });
      }
    })}
    <ArrowComponent onClick={onClick} open={open} />
  </div>
);

const Tabs = ({
  onSelectTab,
  activeTabIndex,
  style,
  className,
  children,
  wrap,
  mode,
  contentClassName,
  ...props
}) => {
  const dropdownMode = mode === "dropdown";
  const vertical = mode === "vertical" || dropdownMode;
  const renderChildrenTabs = useCallback(() => {
    return React.Children.toArray(children)
      .filter(Boolean)
      .map((child, index) => {
        const element = React.cloneElement(child, {
          "data-testid": `tab-${index}`,
          onSelect: onSelectTab,
          tabIndex: index,
          isActive: index === activeTabIndex,
          mode
        });
        return dropdownMode ? (
          <DropdownItem className={styles.customDropdownItem}>
            {element}
          </DropdownItem>
        ) : (
          element
        );
      });
  }, [children, activeTabIndex, mode, onSelectTab, dropdownMode]);

  const tabs = useMemo(
    () => (
      <ul
        className={classNames(
          vertical ? styles.tabsNavVertical : styles.tabsNav,
          wrap && styles.wrap,
          className
        )}
        style={style}
        {...props}>
        {renderChildrenTabs()}
      </ul>
    ),
    [vertical, wrap, className, props, renderChildrenTabs, style]
  );

  const getActiveChild = (props) => {
    return (
      <TabDropdownTrigger
        {...props}
        childrenTabs={children}
        activeTabIndex={activeTabIndex}
      />
    );
  };

  const transition = useTransition(activeTabIndex, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 350 }
  });

  return (
    <>
      {dropdownMode ? (
        <Dropdown
          customDropdownTrigger={getActiveChild}
          closeOnOutsideClick={true}
          className={className}
          itemsListClassName={classNames(styles.dropdownListClass)}>
          {tabs}
        </Dropdown>
      ) : (
        tabs
      )}
      {transition(({ opacity }) => (
        <animated.div style={{ opacity }} className={contentClassName}>
          {children[activeTabIndex] && children[activeTabIndex].props.children}
        </animated.div>
      ))}
    </>
  );
};

TabDropdownTrigger.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool,
  ArrowComponent: PropTypes.func,
  childrenTabs: PropTypes.node,
  activeTabIndex: PropTypes.number
};

Tabs.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onSelectTab: PropTypes.func.isRequired,
  activeTabIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  wrap: PropTypes.bool,
  mode: PropTypes.oneOf(["horizontal", "vertical", "dropdown"]),
  contentClassName: PropTypes.string
};

Tabs.defaultProps = {
  wrap: false,
  mode: "horizontal"
};

export default Tabs;
