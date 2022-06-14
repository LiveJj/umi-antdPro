import React, { useState, useRef, useLayoutEffect } from 'react';
import { GridContent, PageContainer } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import Banner from './Banner';
import HubSetch from './HubSetch';
import { connect } from 'umi';

import styles from './Welcome.less';
const { Item } = Menu;

function Layout({ market: { clname, xlname }, dispatch, loading }) {
  const menuMap = {
    first: clname,
    two: xlname,
  };
  const [initConfig, setInitConfig] = useState({
    mode: 'inline',
    selectKey: 'contact',
  });
  const dom = useRef();

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }

      let mode = 'inline';
      const { offsetWidth } = dom.current;

      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      setInitConfig({ ...initConfig, mode: mode });
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const renderChildren = () => {
    const { selectKey } = initConfig;

    switch (selectKey) {
      case 'first':
        return <HubSetch />;

      case 'two':
        return <Banner />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <div className={styles.main}>
        <div className={styles.leftMenu}>
          <Menu
            mode={initConfig.mode}
            selectedKeys={[initConfig.selectKey]}
            onClick={({ key }) => {
              setInitConfig({ ...initConfig, selectKey: key });
            }}
          >
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
          {renderChildren()}
        </div>
      </div>
    </PageContainer>
  );
}

export default connect((state) => ({
  market: state.market,
  loading: state.loading,
}))(Layout);
