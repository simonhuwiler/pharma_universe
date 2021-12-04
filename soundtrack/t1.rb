
use_bpm 160

use_synth :dark_ambience
play "C2", attack: 15, sustain: 550, amp: 0.5

sleep 30

use_synth :hollow
play "C4", attack: 15, sustain: 150, release: 2, amp: 0.5

sleep 30

with_synth :tb303 do
  play_pattern_timed [:c4, :eb4, :ab3], 24, attack: 15, sustain: 30, release: 10, note_slide: 6, cutoff: 50
  sleep 8
  with_fx :slicer, phase: 0.1, mix: 0, mix_slide: 10 do | r |
    s = play :g3, attack: 8, sustain: 25, release: 6, cutoff: 50, note_slide: 2
    sleep 10
    control r, mix: 0.5
    sleep 12
    control s, note: :f3
    sleep 4
  end
end

use_synth :hollow
play chord(:f3, :minor), attack: 5, sustain: 500, release: 2
sleep 4

define :background do |loops|
  in_thread do
    with_synth :prophet do
      with_fx :reverb, room: 1, amp: 0.1, amp_slide: 5 do |fx|
        control fx, amp: 0.6
        loops.times do
          
          8.times do
            play_pattern_timed [:f4, :gs4, :c5], 0.33, release: 0.2, attack: 0.05, cutoff: rrand(60, 90), amp: 0.4
            sleep 0.01
          end
          8.times do
            play_pattern_timed [:as4, :cs5, :f5], 0.33, release: 0.2, attack: 0.05, cutoff: rrand(60, 90), amp: 0.4
            sleep 0.01
          end
          8.times do
            play_pattern_timed [:f4, :gs4, :c5], 0.33, release: 0.2, attack: 0.05, cutoff: rrand(60, 90), amp: 0.4
            sleep 0.01
          end
          8.times do
            play_pattern_timed [:c4, :e4, :g4], 0.33, release: 0.2, attack: 0.05, cutoff: rrand(60, 90), amp: 0.4
            sleep 0.01
          end
        end
      end
    end
  end
end


define :rythm_with_slight_bass do |loops|
  in_thread do
    with_synth :fm do
      with_fx :reverb, room: 0.8 do
        loops.times do
          2.times do
            play_chord [:f1, :gs3, :c4, :f2, :f3], release: 0.2, attack: 0.05, amp: 2
            sleep 1
          end
          sleep 8 - 2
          2.times do
            play_chord [:as1, :f1, :cs4, :as4, :f3], release: 0.2, attack: 0.05, amp: 2
            sleep 1
          end
          sleep 8 - 2
          2.times do
            play_chord [:f1, :gs3, :c4, :f2, :f3], release: 0.2, attack: 0.05, amp: 2
            sleep 1
          end
          sleep 8 - 2
          2.times do
            play_chord [:c1, :e2, :g2, :c3, :as2], release: 0.2, attack: 0.05, amp: 2
            sleep 1
          end
          sleep 8 - 2
        end
      end
    end
  end
end

define :beep_beep do |n|
  with_synth :hollow do
    4.times do
      with_fx :reverb, room: 0.5 do
        with_fx :krush, gain: 5 do
          play n, attack: 0.1, release: 0.5, amp: 1
          sleep 1
          3.times do
            play n, release: 0.3, attack: 0.1, amp: 1
            sleep 0.33
          end
          sleep 0.01
        end
      end
    end
  end
end

background 2
sleep 64

background 1
rythm_with_slight_bass 1
sleep 32


with_fx :reverb, room: 1 do
  #live_loop :time do
  synth :prophet, release: 8, note: :c1, cutoff: 90, amp: 2, attack: 0.5
  sleep 8
  #end
end

rythm_with_slight_bass 1
in_thread do
  8.times do
    beep_beep :f4
    beep_beep :as4
    beep_beep :f4
    beep_beep :c4
  end
end

define :ramsch do
  in_thread do
    2.times do
      rythm_with_slight_bass 2
      16.times do
        4.times do
          sample :bd_haus
          sleep 1
        end
      end
    end
  end
end


sleep 32
rythm_with_slight_bass 2

in_thread do
  2.times do
    with_synth :fm do
      with_fx :reverb, room: 0.8, amp: 0.6 do
        with_fx :krush, gain: 5, mix: 0.1 do |fx|
          2.times do
            play_pattern_timed [:f4, :gs4, :f4, :gs4, :f4, :g4], 0.33, attack: 0, release: 0.4, amp: 1
            sleep 0.02
            play_pattern_timed [:gs4, :f4], 1, attack: 0,  release: 0.9, amp: 1
          end
          
          2.times do
            play_pattern_timed [:as4, :cs5,:as4, :cs5, :as4, :c5, :cs5, :c5, :as4, :f4, :ds4, :cs4], 0.33, attack: 0, release: 0.4, amp: 1
            sleep 0.04
          end
          
          2.times do
            play_pattern_timed [:f4, :gs4, :f4, :as4, :cs5, :g4], 0.33, attack: 0, release: 0.4, amp: 1
            sleep 0.02
            play_pattern_timed [:gs4, :f4], 1, attack: 0,  release: 0.9, amp: 1
          end
          
          4.times do
            
            play_pattern_timed [:f4, :ds4, :cs4, :ds4, :cs4, :c4], 0.33, attack: 0, release: 0.4, amp: 1
            sleep 0.02
          end
        end
      end
    end
  end
end



rythm_with_slight_bass 2

=begin

with_synth :chipbass do
  with_fx :reverb, room: 1 do
    with_fx :echo, phase: 0.08, mix: 0.8 do
      play_pattern_timed [:f2, :f2, :f2], 0.5, attack: 0.1, release: 0.1, amp: 0.02
      play_pattern_timed [:as2, :f3], 3, attack: 0.1, release: 0.1, amp: 0.02
      play_pattern_timed [:ds3, :d3], 0.8, attack: 0.1, release: 0.5, amp: 0.02
      play :c3, attack: 0.1, release: 3, amp: 0.02
    end
  end
end
=end


#play chord(:f3, :minor), attack: 5, sustain: 20, release: 5, note_slide: 3, cutoff: 50
=begin
use_synth :tb303
with_fx :flanger, phase: 1, mix: 0.8 do
  with_fx :echo, phase: 0.08, mix: 0.8 do
    play_pattern_timed [:f2, :f2, :f2], 0.2, attack: 0.1, release: 0.1, amp: 0.02
    play_pattern_timed [:as2, :f3], 1, attack: 0.1, release: 0.1, amp: 0.02
    play_pattern_timed [:ds3, :d3], 0.4, attack: 0.1, release: 0.5, amp: 0.02
    play :c3, attack: 0.1, release: 3, amp: 0.02
  end

end
=end
=begin
with_fx :reverb do |rev|
  control rev, mix: 0.5
  r = rrand(0.05, 0.3)

  #play chord(:e3, :minor), release: r, cutoff: 50, amp: 0.5
  play_pattern_timed [chord(:e3, :minor), chord(:d3, :minor)], 0.5, release: r, cutoff: 50, amp: 0.5

  64.times do
    play chord(:e3, :minor), release: r, cutoff: rrand(50, 90), amp: 0.5
    #play chord(:e3, :minor).choose, release: r, cutoff: rrand(50, 90), amp: 0.5
    sleep 0.125
  end
end



sleep 10

loop do
  with_synth :tb303 do
    #with_fx(:slicer, phase: [0.25,0.125].choose) do
    with_fx(:reverb, room: 0.5, mix: 0.3) do
      start_note = chord([:b1, :b2, :e1, :e2, :b3, :e3].choose, :minor).choose
      final_note = chord([:b1, :b2, :e1, :e2, :b3, :e3].choose, :minor).choose

      p = play :c1, release: 5, note_slide: 4, cutoff: 40, cutoff_slide: 4
      control p, note: :c4, cutoff: 10
    end
    #end
  end
  sleep 8
end

=end
=begin
with_fx :slicer, phase: 0.125 do
  sample :ambi_lunar_land, sustain: 0, release: 8, amp: 2
end
=end