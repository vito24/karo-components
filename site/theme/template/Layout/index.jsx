import React from 'react';
import PropTypes from 'prop-types';
import { enquireScreen } from 'enquire-js';
import { IntlProvider, addLocaleData } from 'react-intl';
import { LocaleProvider } from 'antd'; // TODO
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from './Header';
import * as utils from '../../utils';
import enLocale from '../../en-US';
import cnLocale from '../../zh-CN';

import 'antd/dist/antd.css'; // TODO

import '../../static/style';

let isMobile = false;
enquireScreen(b => {
  isMobile = b;
});

export default class Layout extends React.Component {
  static childContextTypes = {
    isMobile: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const { pathname } = props.location;
    const appLocale = utils.isZhCN(pathname) ? cnLocale : enLocale;
    addLocaleData(appLocale.data);

    this.state = {
      appLocale,
      isMobile
    };
  }

  getChildContext() {
    return {
      isMobile: this.state.isMobile
    }
  }

  componentDidMount() {
    enquireScreen(b => {
      this.setState({
        isMobile: !!b,
      });
    });
  }

  render() {
    const { appLocale } = this.state;
    const { children, ...restProps } = this.props;

    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <LocaleProvider locale={appLocale.locale === 'zh-CN' ? zhCN : null}>
          <div className="page-wrapper">
            <Header {...restProps} />
            {children}
          </div>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
