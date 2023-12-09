import { Result } from 'antd';
import React, { Component, ReactNode } from 'react';

interface Props {
  hookError?: any;
  children?: ReactNode;
}
interface State {
  error: any;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error: any) {
    // 更新状态，以便下一次渲染将显示后备 UI。
    return {
      error,
    };
  }

  componentDidCatch(error: any, info: { componentStack: any }) {
    // 示例“组件堆栈”：
    //   在 ComponentThatThrows 中（由 App 创建）
    //   在 ErrorBoundary 中（由 APP 创建）
    //   在 div 中（由 APP 创建）
    //   在 App 中
    console.error(error, info);
  }

  getErrorMessage(error?: any) {
    return `组件错误：${error instanceof Error ? error.message : String(error)}`;
  }

  render() {
    const error = this.state.error || this.props.hookError;
    if (error) {
      return (
        <div>
          <Result status="error" title={this.getErrorMessage(error)} />
        </div>
      );
    }
    return this.props.children;
  }
}
