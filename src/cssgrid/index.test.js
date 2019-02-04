import React from 'react';
import renderer from 'react-test-renderer';
import ie11cssGridPrefixer, {
  css,
  AutoPlacer,
  AutoPlace,
  flattenChildren,
  getMediaQueryNodeChildCss,
  unsetStyles
} from './index';

test('getMediaQueryNodeChildCss', () => {
  const node = {
    type: 'MediaQuery',
    props: {
      children: {
        type: 'react.fragment',
        props: {
          children: {
            props: {
              css: css`color: red;`
            }
          }
        }
      }
    }
  }
  const mediaQueryCss = getMediaQueryNodeChildCss(node);
  expect(mediaQueryCss.styles).toEqual('color: red;')
});

describe('unsetStyles ', () => {
  let before = `
    display: some;
    do: that;
    border: 1px solid blue;
    style: this;
  `;
  const after = `
    *, div, p {
      display: unset;
      do: unset;
      border: unset;
      style: unset;
    }
  `.replace(/\s/g,'');
  test('unset function', () => {
    expect(unsetStyles(before).replace(/\s/g,'')).toEqual(after);
  });
  test('cssStyles unset', () => {
    const cssStyles = css`${unsetStyles(before)}`.styles.replace(/\s/g,'');
    expect(cssStyles).toEqual(after);
  });
  test('unset on one line', () => {
    before = `display: some; do: that; border: 1px solid blue; style: this;`;
    expect(unsetStyles(before).replace(/\s/g,'')).toEqual(after);
  });
  test('cssStyles unset on one line', () => {
    const cssStyles = css`${unsetStyles(before)}`.styles.replace(/\s/g,'');
    expect(cssStyles).toEqual(after);
  });
})
describe('flattenChildren', () => {
  test('nested arrays with undefined', () => {
    const items = [
      0,
      undefined,
      [24, [1, 7, undefined]],
      8
    ];
    const flattened = flattenChildren(items);
    console.log('log flattened', { flattened })
    expect(flattened).toEqual([0, 24, 1, 7, 8]);
  });
  test('nested arrays with object', () => {
    const items = [
      0,
      [24, [1, 7, [[500]]]],
      [22, [{j: 5}]],
      8
    ];
    const flattened = flattenChildren(items);
    console.log('log flattened', { flattened })
    expect(flattened).toEqual([0, 24, 1, 7, 500, 22, {j: 5}, 8]);
  });
  test('nested props', () => {
    const items = [
      0,
      {
        type: 'react.fragment',
        props: {
          children: [
            1, 2
          ]
        }
      }
    ];
    const flattened = flattenChildren(items);
    expect(flattened).toEqual([0, 1, 2]);
  });
  test('fragment direct children', () => {
    const items = {
      type: 'react.fragment',
      props: {
        children: [
          0, 1, 2
        ]
      }
    };
    const flattened = flattenChildren(items);
    expect(flattened).toEqual([0, 1, 2]);
  });
  test('nested with props and arrays', () => {
    const items = [
      0,
      {
        type: 'react.fragment',
        props: {
          children: [
            {
              type: 'react.fragment',
              props: {
                children: [1, {
                  type: 'react.fragment',
                  props: {
                    children: [{
                      type: 'react.fragment',
                      props: {
                        children: [2, {
                          type: 'react.fragment',
                          props: {
                            children: { notArray: true, val: 3 }
                          }
                        }],
                      }
                    }]
                  }
                }, [[{ val: 4}]]]
              }
            },
            [5],
            6
          ]
        }
      },
      [7, 8],
      9
    ];
    const flattened = flattenChildren(items);
    expect(flattened).toEqual([0, 1, 2, { notArray: true, val: 3}, { val: 4 }, 5, 6, 7, 8, 9]);
  });
});

test('ie11cssGridPrefixer and css', () => {
  const cols = new Array(7);
  const before = `
      display: grid;
      justify-items: center;
      grid-column-gap: 0.1em;
      grid-row-gap: 0.1em;
      grid-template-columns: repeat(${cols.length}, ${100 / cols.length}%);
      padding: 0px 35px 0 17px;
      position: relative;
      overflow: hidden;
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 100%;
    `;
  const after = `
      display: -ms-grid;
      display: grid;
      justify-items: center;
      grid-column-gap: 0.1em;
      grid-row-gap: 0.1em;
      -ms-grid-columns: repeat(7, 14.285714285714286%);
      grid-template-columns: repeat(7, 14.285714285714286%);
      padding: 0px 35px 0 17px;
      position: relative;
      overflow: hidden;
      display: -ms-grid;
      display: grid;
      -ms-grid-columns: 100%;
      grid-template-columns: 100%;
      -ms-grid-rows: 100%;
      grid-template-rows: 100%;
    `;
  expect(ie11cssGridPrefixer(before)).toEqual(after);
  expect(css`${before}`.styles.includes(after)).toEqual(true);
});
test('auto placement', () => {
  const before = `
      thatStyle: visible;
      someStyle: cool;
    `;
  let after = `
      ${before}
      -ms-grid-column: 3;
      -ms-grid-row: 1;
    `;
  const autoPlacer = AutoPlacer({ colLength: 3 });
  autoPlacer.next();
  autoPlacer.next();
  expect(autoPlacer.next(before).styles.trim()).toEqual(after.trim());
  after = `
      ${before}
      -ms-grid-column: 1;
      -ms-grid-row: 2;
    `;
  expect(autoPlacer.next`${before}`.styles.trim()).toEqual(after.trim());
});
test('react component wrapper', () => {
  let component = renderer.create(
    <AutoPlace>
      <p>child one</p>
      <h2>child two</h2>
      <p>child three</p>
      <h3>child four</h3>
      <div>child five</div>
    </AutoPlace>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <AutoPlace colLength={3}>
      <p>child one</p>
      <h2>child two</h2>
      <p>child three</p>
      <h3>child four</h3>
      <div>child five</div>
    </AutoPlace>
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <AutoPlace colLength={4}>
      <p>child one</p>
      <h2>child two</h2>
      <p>child three</p>
      <h3>child four</h3>
      <div>child five</div>
    </AutoPlace>
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <AutoPlace colLength={1}>
      <p>child one</p>
      <h2>child two</h2>
      <p>child three</p>
      <h3>child four</h3>
      <div>child five</div>
    </AutoPlace>
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <AutoPlace colLength={5}>
      {new Array(5).fill('').map(() => <p>Test grandChildren 1</p>)}
      {new Array(4).fill('').map(() => <p>Test grandChildren 2</p>)}
    </AutoPlace>
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <AutoPlace>
    </AutoPlace>
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <AutoPlace>
      <h1>Single</h1>
    </AutoPlace>
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
