
use_synth :dark_ambience
play "C2", attack: 2, sustain: 50, amp: 0.5

sleep 10

use_synth :hollow
play "C4", attack: 5, sustain: 50, release: 2, amp: 0.5


sleep 10
with_synth :tb303 do
  play_pattern_timed [:c4, :eb4, :ab3], 8, attack: 5, sustain: 20, release: 5, note_slide: 3, cutoff: 50
  
  with_fx :slicer, phase: 0.1, mix: 0.5 do | r |
    play :g3, attack: 4, sustain: 12, release: 5, cutoff: 50
  end
  
  
end

use_synth :tb303
with_fx :flanger, phase: 1, mix: 0.8 do
  with_fx :echo, phase: 0.08, mix: 0.8 do
    play_pattern_timed [:f2, :f2, :f2], 0.2, attack: 0.1, release: 0.1, amp: 0.02
    play_pattern_timed [:as2, :f3], 1, attack: 0.1, release: 0.1, amp: 0.02
    play_pattern_timed [:ds3, :d3], 0.4, attack: 0.1, release: 0.5, amp: 0.02
    play :c3, attack: 0.1, release: 3, amp: 0.02
  end
  
end

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