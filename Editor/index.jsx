import React, { useEffect, useState } from 'react';
import SectionsHead from '../../components/common/SectionsHead';
import { useDispatch, useSelector } from 'react-redux';
import { getAbout } from "../../redux/actions/userActions";
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Parser from 'html-react-parser';

const AboutUsDisplay = () => {
  const dispatch = useDispatch();
  const { about } = useSelector(state => state.about);
  const [contentHtml, setContentHtml] = useState('');

  useEffect(() => {
    dispatch(getAbout());
  }, [dispatch]);

  const options = {
    inlineStyleFn: (styles) => {
      const styleObj = {};
      styles.forEach((style) => {
        if (style.startsWith('color-rgb')) {
          const color = style.replace('color-rgb', 'rgb');
          styleObj.color = color;
        }
        if (style.startsWith('bgcolor-rgb')) {
          const bgColor = style.replace('bgcolor-rgb', 'rgb');
          styleObj.backgroundColor = bgColor;
        }
        if (style.startsWith('fontsize-')) {
          const fontSize = style.replace('fontsize-', '') + 'px';
          styleObj.fontSize = fontSize;
        }
        if (style.startsWith('fontfamily-')) {
          const fontFamily = style.replace('fontfamily-', '');
          styleObj.fontFamily = fontFamily;
        }
      });
      if (Object.keys(styleObj).length > 0) {
        return {
          element: 'span',
          style: styleObj,
        };
      }
    },
    blockStyleFn: (block) => {
      const blockStyle = {};
      if (block.getData().get('color')) {
        blockStyle.color = block.getData().get('color');
      }
      if (Object.keys(blockStyle).length > 0) {
        return {
          style: blockStyle,
        };
      }
    },
    entityStyleFn: (entity) => {
      const entityType = entity.get('type').toLowerCase();
      if (entityType === 'image') {
        const data = entity.getData();
        return {
          element: 'img',
          attributes: {
            src: data.src,
          },
          style: {
            maxWidth: '100%',
          },
        };
      }
    },
  };

  useEffect(() => {
    if (about && about.about) {
      try {
        const contentState = convertFromRaw(JSON.parse(about.about));
        const html = stateToHTML(contentState, options);
        setContentHtml(html);
      } catch (error) {
        console.error('Error parsing content:', error);
      }
    }
  }, [about]);

  return (
    <div className='bg-page1'>
      <section className="about">
        <div className="container">
          <SectionsHead heading="About Us" /><br />
          <div className="about p-5" style={{ textAlign: "justify" }}>
            {/* Ensure Parser renders contentHtml as valid HTML */}
            {Parser(contentHtml)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsDisplay;
