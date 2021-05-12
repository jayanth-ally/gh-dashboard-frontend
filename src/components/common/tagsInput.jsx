import {useState,useEffect} from 'react';

const TagsInput = props => {
    return (
      <div className="tags-input">
        <ul id="tags">
          {props.tags.map((tag, index) => (
            <li key={index} className="tag">
              <span className='tag-title'>{tag.login}</span>
              <span className='tag-close-icon'
                onClick={() => props.removeTags(tag)}
              >
                x
              </span>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add users"
          onChange={props.onInput}
          value={props.value}
          ref={(input)=> input && props.focus && input.focus()}
        />
      </div>
    );
  };

export default TagsInput;