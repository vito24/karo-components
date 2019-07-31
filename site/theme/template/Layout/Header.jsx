import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'bisheng/router';
import { FormattedMessage } from 'react-intl';
import docsearch from 'docsearch.js';
import { Row, Col, Menu, Button, Icon, Input, Popover } from 'antd'; // TODO
import * as utils from '../../utils';

function initDocSearch(locale) {
  const lang = locale === 'zh-CN' ? 'cn' : 'en';
  docsearch({
    apiKey: '60ac2c1a7d26ab713757e4a081e133d0',
    indexName: 'ant_design',
    inputSelector: '#search-box input',
    algoliaOptions: { facetFilters: [`tags:${lang}`] },
    transformData(hits) {
      hits.forEach(hit => {
        hit.url = hit.url.replace('ant.design', window.location.host); // eslint-disable-line
        hit.url = hit.url.replace('https:', window.location.protocol); // eslint-disable-line
      });
      return hits;
    },
    debug: false // Set debug to true if you want to inspect the dropdown
  });
}

export default class Header extends React.Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired
  };

  state = {
    menuVisible: false
  };

  componentDidMount() {
    const { intl } = this.context;
    document.addEventListener('keyup', event => {
      if (event.keyCode === 83 && event.target === document.body) {
        this.searchInput.focus();
      }
    });
    initDocSearch(intl.locale);
  }

  onMenuVisibleChange = visible => {
    this.setState({
      menuVisible: visible
    });
  };

  handleShowMenu = () => {
    this.setState({
      menuVisible: true
    });
  };

  handleLangChange = () => {
    const {
      location: { pathname },
    } = this.props;
    const currentProtocol = `${window.location.protocol}//`;
    const currentHref = window.location.href.substr(currentProtocol.length);
    const localizedPathname = utils.getLocalizedPathname(pathname, !utils.isZhCN(pathname));
    const isDev = process.env.NODE_ENV === 'development';
    localStorage.setItem('locale', utils.isZhCN(pathname) ? 'en-US' : 'zh-CN');

    window.location.href =
      currentProtocol +
      currentHref.replace(
        window.location.pathname,
        isDev ? localizedPathname : `/karo-components${localizedPathname}`,
      );
  };

  render() {
    const { menuVisible } = this.state;
    const {
      isMobile,
      intl: { locale }
    } = this.context;
    const { location, themeConfig } = this.props;
    const menuMode = isMobile ? 'inline' : 'horizontal';
    const isZhCN = locale === 'zh-CN';

    const module = location.pathname
      .replace(/(^\/|\/$)/g, '')
      .split('/')
      .slice(0, -1)
      .join('/');
    let activeMenuItem = module || 'home';
    if (activeMenuItem === 'components' || location.pathname === 'changelog') {
      activeMenuItem = 'docs/react';
    }

    const menu = [
      <Button
        ghost
        size="small"
        key="lang-button"
        className="header-lang-button"
        onClick={this.handleLangChange}
      >
        <FormattedMessage id="app.header.lang" />
      </Button>,
      <Menu
        className="menu-site"
        mode={menuMode}
        selectedKeys={[activeMenuItem]}
        id="nav"
        key="nav"
      >
        <Menu.Item key="home" className="hide-in-home-page">
          <Link to={utils.getLocalizedPathname('/', isZhCN)}>
            <FormattedMessage id="app.header.menu.home" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/react">
          <Link to={utils.getLocalizedPathname('/docs/react/introduce', isZhCN)}>
            <FormattedMessage id="app.header.menu.components" />
          </Link>
        </Menu.Item>
      </Menu>
    ];

    const searchPlaceholder = locale === 'zh-CN' ? '在 ant.design 中搜索' : 'Search in ant.design';

    return (
      <header id="header" className="clearfix">
        {isMobile && (
          <Popover
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={menu}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter
            onVisibleChange={this.onMenuVisibleChange}
          >
            <Icon className="nav-phone-icon" type="menu" onClick={this.handleShowMenu} />
          </Popover>
        )}
        <Row>
          <Col xxl={4} xl={5} lg={5} md={5} sm={24} xs={24}>
            <Link to="/index-cn" id="logo">
              <img
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              />
              <img
                alt="Ant Design"
                src="https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg"
              />
            </Link>
          </Col>
          <Col xxl={20} xl={19} lg={19} md={19} sm={0} xs={0}>
            <div id="search-box">
              <Icon type="search" />
              <Input ref={inst => (this.searchInput = inst)} placeholder={searchPlaceholder} />
            </div>
            {!isMobile && menu}
          </Col>
        </Row>
      </header>
    );
  }
}
