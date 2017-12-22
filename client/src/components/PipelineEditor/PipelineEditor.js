import * as R from 'ramda'
import React, { Component } from 'react'
import styled from 'styled-components'
import PodCardList from '../../components/PodCardList'
import { CHOOSE_POD, CHOOSE_EVENT } from '../../settings'

const Container = styled.div`
  width: 100%;
  height: 100%;
`

class PipelineEditor extends Component {

  /**
   * Renders editor according to given condition
   * @returns {XML}
   * @private
   */
  _renderEditor = () => {
    const { allPods, index, type, step } = this.props
    if (step === CHOOSE_POD) {
      return (
        <PodCardList
          allPods={allPods}
          onClick={(id) => this.props.onClickPodCard(index, type, step, id)}
        />
      )
    } else if (step === CHOOSE_EVENT) {
      return (
        <div>Pick an event</div>
      )
    }
  }
  render() {
    return (
      <Container>
        {this._renderEditor()}
      </Container>
    )
  }
}

export default PipelineEditor
