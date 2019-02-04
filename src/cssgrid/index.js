/** @jsx jsx */
import { jsx } from '@emotion/core';
import { css as emotionCss } from '@emotion/core';
import emotionStyled from '@emotion/styled';
import PropTypes from 'prop-types';

const replaceTable = [
  ['grid-template-columns', '-ms-grid-columns'],
  ['grid-template-rows', '-ms-grid-rows'],
  ['grid-row-start', '-ms-grid-row'],
  ['grid-column-start', '-ms-grid-column'],
  ['align-self', '-ms-grid-row-align'],
  ['justify-self', '-ms-grid-column-align']
];

export const getColLengthValue = (colLength) => {
  let val = new Array(colLength).fill().reduce((sum) => {
    sum += '1fr ';
    return sum;
  }, '');

  return val.trim() + ';';
};

export default function ie11cssGridPrefixer(styles) {
  if (typeof styles.replace !== 'function') {
    return styles;
  }
  styles = styles.replace(/display: grid;/g, `display: -ms-grid;
      display: grid;`);
  replaceTable.forEach(([cssGrid, msCssGrid]) => {
    const reg = new RegExp(`${cssGrid}: .*;`, 'g');
    const matches = styles.match(reg);
    if (!matches) {
      return;
    }
    matches.forEach(match => {
      const prefixed = match.replace(cssGrid, msCssGrid);
      styles = styles.replace(match, `${prefixed}
      ${match}`);
    });
  });
  return styles;
}

export const css = (strings, ...values) => {
  const styles = strings.map((s, i) => !values[i] ? s : s + values[i]).join('');
  const prefixedStyles = ie11cssGridPrefixer(styles);
  return emotionCss`${prefixedStyles}`;
};
export const styled = tag => (strings, ...values) => {
  const styles = strings.map((s, i) => !values[i] ? s : s + values[i]).join('');
  const prefixedStyles = ie11cssGridPrefixer(styles);
  return emotionStyled(tag)`${prefixedStyles}`;
};
function* autoplacement({ colLength }) {
  const placement = {
    x: 1,
    y: 1
  };
  let iteration = 0;
  while (true) {
    const nextColumnIndex = iteration++ % colLength;
    placement.x = nextColumnIndex + 1;
    placement.y = Math.ceil(iteration / colLength);
    let styles = css`${yield}
      -ms-grid-column: ${placement.x};
      -ms-grid-row: ${placement.y};
    `;
    yield styles;
  }
}
export const AutoPlacer = ({ colLength }) => {
  const gen = autoplacement({ colLength });
  gen.next();
  return ({
    next: (strings, ...values) => {
      if (Array.isArray(strings)) {
        strings = strings.map((s, i) => !values[i] ? s : s + values[i]).join('');
      }
      return gen.next(strings).value || gen.next(strings).value;
    }
  });
};

export function flattenChildren(items, flattened, index) {
  const isNodeFragment = this && this.isFragment ? this.isFragment : isFragment;

  flattened = flattened ? flattened : [];
  index = index ? index : 0;

  if(index >= items.length || !items) {
    return flattened;
  }

  const curr = Array.isArray(items) ? items[index] : items;
  if(Array.isArray(curr)) {
    flattened = flattened.concat(flattenChildren(curr))
  } else if(isNodeFragment(curr)) {
    flattened = flattened.concat(flattenChildren(curr.props.children))
  } else if (typeof curr !== 'undefined') {
    flattened.push(curr);
  }

  if(!Array.isArray(items)) {
    return flattened;
  }
  return flattenChildren(items, flattened, ++index);
}

const isFragment = node => node && node.type && node.type.toString().match(/react.fragment/)

export const getMediaQueryNodeChildCss = (node) => {
  const flattened = flattenChildren.call({
    isFragment: () => node && node.type && node.type.toString().match(/react.fragment|MediaQuery/)
  }, node);
  return flattened[0].props.css;
}

export const unsetStyles = styles => `
  *, div, p {
    ${styles.replace(/([a-z0-9\s]*(?!;)[a-z];)/gi, ' unset;')}
  }
`

export const AutoPlace = (props) => {
  let { children, colLength, unsetChildStyles } = props;
  if (isFragment(children)) {
    children = children.props.children;
  }
  if (!Array.isArray(children)) {
    children = !children ? [] : [children];
  }
  children = flattenChildren(children)
  if (!colLength) {
    colLength = children.length;
  }

  const autoPlacer = AutoPlacer({ colLength });

  let containerCss = css`
    display:grid;
    grid-template-columns: ${getColLengthValue(colLength)};
  `;
  if (props.css) {
    containerCss = [containerCss, props.css];
  }
  return (
    <div
      {...props}
      data-auto-placer-container
      data-unset-child-styles={unsetChildStyles}
      data-col-length={colLength}
      data-children={children.length}
      css={containerCss}
    >
      {
        children.map((node, index) => {
          let autoPlacerCss = autoPlacer.next``;
          const autoPlacerCssStyles = autoPlacerCss.styles;
          let hasUnsetCssStyles = false;
          if (node && node.props && node.props.css) {
            autoPlacerCss = [
              node.props.css,
              css`${unsetChildStyles ? unsetStyles(node.props.css.styles) : ''}`,
              autoPlacerCss
            ];
            hasUnsetCssStyles = true;
          } else if(node.type.toString().match(/MediaQuery/)) {
            const mediaQueryChildCss = getMediaQueryNodeChildCss(node);
            autoPlacerCss = [
              mediaQueryChildCss,
              css`${unsetChildStyles ? unsetStyles(mediaQueryChildCss.styles) : ''}`,
              autoPlacerCss
            ];
            hasUnsetCssStyles = true;
          }
          return (
            <div key={index}
              data-auto-placer-item
              data-has-unset-css-styles={hasUnsetCssStyles}
              data-auto-placer-styles={autoPlacerCssStyles}
              css={autoPlacerCss}
            >
              {node}
            </div>
          );
        })
      }
    </div>
  );
};
AutoPlace.propTypes = {
  colLength: PropTypes.number,
  children: PropTypes.array,
  unsetChildStyles: PropTypes.bool
};
