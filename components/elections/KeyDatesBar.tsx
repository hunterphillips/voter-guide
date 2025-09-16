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
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Important Dates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates.map((item, index) => {
          const isPassed = isDatePassed(item.date!)
          const isToday = isDateToday(item.date!)
          const isSoon = isDateSoon(item.date!, 7)
          
          let statusStyle = 'bg-gray-100 text-gray-600 border-gray-200'
          let statusLabel = ''
          
          if (isPassed) {
            statusStyle = 'bg-gray-100 text-gray-500 border-gray-200'
            statusLabel = 'Passed'
          } else if (isToday) {
            statusStyle = 'bg-red-100 text-red-800 border-red-200'
            statusLabel = 'Today'
          } else if (isSoon && item.urgent) {
            statusStyle = 'bg-yellow-100 text-yellow-800 border-yellow-200'
            statusLabel = 'Soon'
          } else {
            statusStyle = 'bg-white text-gray-900 border-gray-200'
          }

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${statusStyle} transition-colors`}
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