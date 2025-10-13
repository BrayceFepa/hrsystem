import React, { Component } from "react";

const colorMap = {
  'bg-blue-500': 'bg-blue-100 text-blue-600',
  'bg-green-500': 'bg-green-100 text-green-600',
  'bg-yellow-500': 'bg-yellow-100 text-yellow-600',
  'bg-red-500': 'bg-red-100 text-red-600',
  'bg-purple-500': 'bg-purple-100 text-purple-600',
  'bg-pink-500': 'bg-pink-100 text-pink-600',
  'bg-indigo-500': 'bg-indigo-100 text-indigo-600',
  'bg-gray-500': 'bg-gray-100 text-gray-600',
};

export default class InfoBox extends Component {
  render() {
    const { 
      title, 
      description, 
      icon, 
      color = 'bg-red-500',
      className = ''
    } = this.props;

    const iconBgColor = colorMap[color] || 'bg-red-100 text-red-600';

    return (
      <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex items-center ${className}`}>
        <div className={`${iconBgColor} p-3 rounded-lg mr-4`}>
          <i className={`${icon} text-xl`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate text-center">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 text-center">{description}</p>
        </div>
      </div>
    );
  }
}
