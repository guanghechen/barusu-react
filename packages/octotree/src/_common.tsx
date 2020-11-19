import styled from 'styled-components'
import { getOctotreeStyle } from './theme'


/**
 * icon
 */
export const Icon = styled.i`
  display: inline-block;
  width: (1.25 * $octotree-font-size);
  font-size: $octotree-font-size;
  font-family: octotree;
  font-style: normal;
  text-align: center;
  &::before {
    font-size: inherit;
    font-style: normal;
  }
`


/**
 * title
 */
export const Title = styled.h4`
  color: ${ getOctotreeStyle('colorTitle') };
  font-weight: normal;
  font-style: normal;
`
