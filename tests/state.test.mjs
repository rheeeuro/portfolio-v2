import test from 'node:test';
import assert from 'node:assert/strict';
import { phaseAtHour } from '../src/lib/time.ts';
import { useNavigation } from '../src/stores/navigation.ts';

test('local-time phases respect every boundary including midnight', () => {
  for (const [hour, expected] of [
    [0, 'night'],
    [4, 'night'],
    [5, 'dawn'],
    [6, 'dawn'],
    [7, 'day'],
    [16, 'day'],
    [17, 'sunset'],
    [18, 'sunset'],
    [19, 'night'],
    [23, 'night'],
  ])
    assert.equal(phaseAtHour(hour), expected);
});
test('reselecting the current view does not leave content stuck waiting for a camera transition', () => {
  useNavigation.setState({
    view: 'projects',
    transitioning: false,
    entered: true,
  });
  useNavigation.getState().navigate('projects');
  assert.equal(useNavigation.getState().transitioning, false);
  useNavigation.getState().syncView('projects');
  assert.equal(useNavigation.getState().transitioning, false);
  useNavigation.getState().navigate('about');
  assert.equal(useNavigation.getState().view, 'about');
  assert.equal(useNavigation.getState().transitioning, true);
  useNavigation.setState({
    view: 'home',
    transitioning: false,
    entered: false,
  });
});
