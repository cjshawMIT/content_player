"use strict";

import React                    from "react";
import assets                   from '../../libs/assets';
import * as ContentActions      from '../../actions/content';
import _                        from 'lodash';
import { connect }              from "react-redux";

const select = (state) => {
  return {
    tableOfContents : state.content.tableOfContents,
    contentName : state.settings.contentName,
    tocMeta: state.content.tocMeta,
    contentPath: state.content.contentPath
  };
};

export class Page extends React.Component {

  iframe(props){
    var current = _.find(
      props.tableOfContents,
      (item) => item.id == props.params.pageId
    );
    if(!current){return;}
    return (
      <iframe src={`${props.contentPath}/${current.content}`} />
    );
  }

  render(){
    var lastModified = this.props.tocMeta.lastModified;
    var footerText = lastModified ? `CLIx release date: ${lastModified}` : undefined;
    return (
      <div className="c-page">
        {this.iframe(this.props)}
        <div className="c-release">
          {footerText}
        </div>
      </div>
    );
  }
}

export default connect(select, ContentActions)(Page);
