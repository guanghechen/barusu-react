import styled from 'styled-components'
import { getOctotreeStyle } from './theme'


/**
 * icon
 */
export const Icon = styled.i`
  display: inline-block;
  font-size: ${ getOctotreeStyle('fontSize') };
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
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${ getOctotreeStyle('colorTitle') };
  font-weight: normal;
  font-style: normal;
`
