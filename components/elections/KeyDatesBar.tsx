'use client'

interface KeyDates {
  registrationDeadline: string | null
  earlyVotingStart: string | null
  earlyVotingEnd: string | null
  absenteeDeadline: string | null
}

interface KeyDatesBarProps {
  electionDate: string
  keyDates: KeyDates
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

function isDatePassed(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

function isDateToday(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return date.getTime() === today.getTime()
}

function isDateSoon(dateString: string, days: number = 7): boolean {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days && diffDays > 0
}

export default function KeyDatesBar({ electionDate, keyDates }: KeyDatesBarProps) {
  const dates = [
    {
      label: 'Registration Deadline',
      date: keyDates.registrationDeadline,
      urgent: true
    },
    {
      label: 'Early Voting Starts',
      date: keyDates.earlyVotingStart,
      urgent: false
    },
    {
      label: 'Early Voting Ends',
      date: keyDates.earlyVotingEnd,
      urgent: false
    },
    {
      label: 'Absentee Deadline',
      date: keyDates.absenteeDeadline,
      urgent: true
    },
    {
      label: 'Election Day',
      date: electionDate,
      urgent: true
    }
  ].filter(item => item.date !== null)

  if (dates.length === 0) {
    return null
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Important Dates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates.map((item, index) => {
          const isPassed = isDatePassed(item.date!)
          const isToday = isDateToday(item.date!)
          const isSoon = isDateSoon(item.date!, 7)
          
          let statusStyle = 'bg-white/10 text-slate-300 border-white/20'
          let statusLabel = ''
          
          if (isPassed) {
            statusStyle = 'bg-slate-500/20 text-slate-400 border-slate-400/30'
            statusLabel = 'Passed'
          } else if (isToday) {
            statusStyle = 'bg-red-500/20 text-red-300 border-red-400/30'
            statusLabel = 'Today'
          } else if (isSoon && item.urgent) {
            statusStyle = 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
            statusLabel = 'Soon'
          } else {
            statusStyle = 'bg-white/10 text-white border-white/20'
          }

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${statusStyle} transition-colors backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{item.label}</span>
                {statusLabel && (
                  <span className="text-xs px-2 py-1 rounded-full bg-current bg-opacity-20">
                    {statusLabel}
                  </span>
                )}
              </div>
              <div className="text-lg font-semibold">
                {formatDate(item.date!)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}